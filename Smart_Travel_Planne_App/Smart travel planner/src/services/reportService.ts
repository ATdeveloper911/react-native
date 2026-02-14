import { ref, push, set } from 'firebase/database';
import { database, storage } from '../config/firebase';
import { Report } from '../types';
import { uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { offlineService } from './offlineService';

export const reportService = {
  async createReport(reportData: {
    userId: string;
    type: Report['type'];
    description: string;
    photos?: string[];
    binId?: string;
    location?: { latitude: number; longitude: number };
  }): Promise<string> {
    const isOnline = await offlineService.isOnline();

    // If offline, queue the report
    if (!isOnline) {
      await offlineService.queueReport({
        ...reportData,
        status: 'pending',
        createdAt: Date.now(),
      });
      throw new Error('Report queued for submission when online');
    }

    // Upload photos if any
    let photoUrls: string[] = [];
    if (reportData.photos && reportData.photos.length > 0) {
      photoUrls = await Promise.all(
        reportData.photos.map(async (photoUri) => {
          const response = await fetch(photoUri);
          const blob = await response.blob();
          const photoRef = storageRef(storage, `reports/${Date.now()}_${Math.random()}.jpg`);
          await uploadBytes(photoRef, blob);
          return await getDownloadURL(photoRef);
        })
      );
    }

    // Create report in database
    const reportRef = push(ref(database, 'reports'));
    const report: Report = {
      id: reportRef.key!,
      userId: reportData.userId,
      binId: reportData.binId,
      type: reportData.type,
      description: reportData.description,
      photos: photoUrls.length > 0 ? photoUrls : undefined,
      location: reportData.location,
      status: 'pending',
      createdAt: Date.now(),
    };

    await set(reportRef, report);
    return reportRef.key!;
  },

  // Sync queued reports when coming back online
  async syncQueuedReports(): Promise<void> {
    const queuedReports = await offlineService.getQueuedReports();
    if (queuedReports.length === 0) return;

    const isOnline = await offlineService.isOnline();
    if (!isOnline) return;

    for (const reportData of queuedReports) {
      try {
        await this.createReport(reportData as any);
      } catch (error) {
        console.error('Failed to sync queued report:', error);
      }
    }

    await offlineService.clearQueuedReports();
  },
};

