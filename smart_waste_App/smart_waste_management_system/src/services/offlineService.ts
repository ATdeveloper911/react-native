import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Report } from '../types';

const OFFLINE_QUEUE_KEY = '@offline_queue';
const OFFLINE_REPORTS_KEY = '@offline_reports';
const OFFLINE_TASK_UPDATES_KEY = '@offline_task_updates';

type QueuedTaskUpdate = {
  taskId: string;
  status: string;
  timestamp: number;
};

export const offlineService = {
  // Check network connectivity
  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  },

  // Subscribe to network state changes
  subscribeToNetwork(callback: (isConnected: boolean) => void): () => void {
    return NetInfo.addEventListener((state) => {
      callback(state.isConnected ?? false);
    });
  },

  // Queue a report
  async queueReport(report: Omit<Report, 'id'>): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(OFFLINE_REPORTS_KEY);
      const reports: Omit<Report, 'id'>[] = existing ? JSON.parse(existing) : [];
      reports.push(report);
      await AsyncStorage.setItem(OFFLINE_REPORTS_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Failed to queue report:', error);
    }
  },

  // Get queued reports
  async getQueuedReports(): Promise<Omit<Report, 'id'>[]> {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_REPORTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get queued reports:', error);
      return [];
    }
  },

  // Clear queued reports
  async clearQueuedReports(): Promise<void> {
    try {
      await AsyncStorage.removeItem(OFFLINE_REPORTS_KEY);
    } catch (error) {
      console.error('Failed to clear queued reports:', error);
    }
  },

  // Queue a task update
  async queueTaskUpdate(taskId: string, status: string): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(OFFLINE_TASK_UPDATES_KEY);
      const updates: QueuedTaskUpdate[] = existing ? JSON.parse(existing) : [];
      updates.push({ taskId, status, timestamp: Date.now() });
      await AsyncStorage.setItem(OFFLINE_TASK_UPDATES_KEY, JSON.stringify(updates));
    } catch (error) {
      console.error('Failed to queue task update:', error);
    }
  },

  // Get queued task updates
  async getQueuedTaskUpdates(): Promise<QueuedTaskUpdate[]> {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_TASK_UPDATES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get queued task updates:', error);
      return [];
    }
  },

  // Clear queued task updates
  async clearQueuedTaskUpdates(): Promise<void> {
    try {
      await AsyncStorage.removeItem(OFFLINE_TASK_UPDATES_KEY);
    } catch (error) {
      console.error('Failed to clear queued task updates:', error);
    }
  },

  // Cache bins data
  async cacheBins(bins: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem('@cached_bins', JSON.stringify(bins));
    } catch (error) {
      console.error('Failed to cache bins:', error);
    }
  },

  // Get cached bins
  async getCachedBins(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem('@cached_bins');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get cached bins:', error);
      return [];
    }
  },
};
