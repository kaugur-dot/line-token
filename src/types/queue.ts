export type TokenStatus = 
  | 'waiting' 
  | 'now-serving' 
  | 'held' 
  | 'skipped' 
  | 'completed' 
  | 'priority';

export interface ServiceOption {
  id: string;
  code: string;
  name: string;
  description: string;
  counterId: string;
  estimatedWaitPerPerson: number; // in minutes
}

export interface QueueToken {
  id: string;
  displayNumber: string; // e.g. "A-19", "C-04", or "#19"
  numericalValue: number;
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  status: TokenStatus;
  joinedAt: number;
  calledAt?: number;
  completedAt?: number;
  counterAssigned?: string;
  priority?: boolean;
  notes?: string;
}

export interface CounterInfo {
  id: string;
  name: string;
  staffName: string;
  isOpen: boolean;
  currentQueueId: string;
  activeTokenId?: string;
}

export interface QueueDepartment {
  id: string;
  name: string;
  code: string;
  prefix: string;
  openCountersCount: number;
  activeCounterName: string;
  avgWaitMinutes: number;
  totalWaiting: number;
  totalServedToday: number;
}

export interface SystemMetrics {
  averageWaitTimeMin: number;
  longestCurrentWaitMin: number;
  totalServedToday: number;
  completionRatePercent: number;
  currentThroughputPerHour: number;
}
