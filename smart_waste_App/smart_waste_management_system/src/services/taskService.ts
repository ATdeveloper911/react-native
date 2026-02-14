import { ref, onValue, off, get, update } from 'firebase/database';
import { database } from '../config/firebase';
import { Task } from '../types';

export const taskService = {
  // Listen to tasks for a specific worker
  subscribeToWorkerTasks(workerId: string, callback: (tasks: Task[]) => void): () => void {
    const tasksRef = ref(database, 'tasks');
    
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      const tasks: Task[] = [];
      
      if (tasksData) {
        Object.keys(tasksData).forEach((taskId) => {
          const task = tasksData[taskId];
          if (task.workerId === workerId) {
            tasks.push({
              id: taskId,
              ...task,
            });
          }
        });
      }
      
      callback(tasks);
    });

    return () => {
      off(tasksRef);
    };
  },

  // Get a single task
  async getTask(taskId: string): Promise<Task | null> {
    const snapshot = await get(ref(database, `tasks/${taskId}`));
    if (snapshot.exists()) {
      return {
        id: taskId,
        ...snapshot.val(),
      };
    }
    return null;
  },

  // Update task status
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const { offlineService } = await import('./offlineService');
    const isOnline = await offlineService.isOnline();

    // If offline, queue the update
    if (!isOnline) {
      await offlineService.queueTaskUpdate(taskId, status);
      throw new Error('Task update queued for sync when online');
    }

    const updates: any = {
      status,
    };

    if (status === 'completed') {
      updates.completedAt = Date.now();
    }

    await update(ref(database, `tasks/${taskId}`), updates);
  },
};

