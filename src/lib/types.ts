export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAccount {
  id: string;
  name: string;
  type: string;
  credentials: {
    username: string;
    password: string;
  };
  logo: string;
  maxDevices: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  serviceAccountId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  userId: string;
  serviceAccountId: string;
  name: string;
  lastAccess: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  serviceAccountId: string;
  deviceId: string;
  action: string;
  timestamp: string;
  details: Record<string, unknown>;
}