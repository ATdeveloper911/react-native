import { useEffect } from 'react';
import { offlineService } from '../services/offlineService';
import { reportService } from '../services/reportService';
import { taskService } from '../services/taskService';

export const useOfflineSync = () => {
  useEffect(() => {
    // Subscribe to network changes
    const unsubscribe = offlineService.subscribeToNetwork(async (isConnected) => {
      if (isConnected) {
        // Sync queued reports
        try {
          await reportService.syncQueuedReports();
        } catch (error) {
          console.error('Failed to sync reports:', error);
        }

        // Sync queued task updates
        try {
          const taskUpdates = await offlineService.getQueuedTaskUpdates();
          for (const update of taskUpdates) {
            try {
              await taskService.updateTaskStatus(update.taskId, update.status as any);
            } catch (error) {
              console.error('Failed to sync task update:', error);
            }
          }
          await offlineService.clearQueuedTaskUpdates();
        } catch (error) {
          console.error('Failed to sync task updates:', error);
        }
      }
    });

    // Initial sync check
    offlineService.isOnline().then((isOnline) => {
      if (isOnline) {
        reportService.syncQueuedReports();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};

