export type UserRole = 'citizen' | 'worker' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  zone?: string;
  name?: string;
  phone?: string;
  profilePicture?: string;
  createdAt: number;
  isActive: boolean;
}

export type BinStatus = 'empty' | 'filling' | 'full' | 'overflow' | 'offline';

export interface Bin {
  id: string;
  zone?: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  fillLevel: number; // 0-100
  status: BinStatus;
  lastUpdate: number;
  lastUpdated?: number;
  isOnline: boolean;
  name?: string;
  assignedWorkerId?: string;
  assignedAt?: number;
  assignedBy?: string;
  dumpCount?: number;
  resetCount?: number;
  lastDumpAt?: number;
  lastResetAt?: number;
}

export interface Task {
  id: string;
  workerId: string;
  binIds: string[];
  route: {
    waypoints: Array<{
      binId: string;
      latitude: number;
      longitude: number;
      order: number;
    }>;
  };
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedAt: number;
  completedAt?: number;
  priority: 'low' | 'medium' | 'high';
}

export interface Report {
  id: string;
  userId: string;
  binId?: string;
  type: 'missed-collection' | 'bin-damage' | 'illegal-dumping' | 'other';
  description: string;
  photos?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'in-review' | 'resolved' | 'rejected';
  createdAt: number;
  resolvedAt?: number;
}

export interface NotificationData {
  type: 'bin-alert' | 'task-assigned' | 'collection-scheduled' | 'report-update';
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Navigation types
export type WorkerStackParamList = {
  Dashboard: undefined;
  TaskDetail: { taskId: string };
  WorkerMap: undefined;
  Profile: undefined;
};

export type AdminStackParamList = {
  MainTabs: undefined;
  Bins: undefined;
  Routes: undefined;
  BinQRCodeAssignment: undefined;
  Profile: undefined;
};

export type CitizenStackParamList = {
  MainTabs: undefined;
  Report: undefined;
  Profile: undefined;
};

