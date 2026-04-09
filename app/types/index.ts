export type JobState = 'NEW' | 'NEW_SAVING' | 'SUBMITTED' | 'ACCEPTED' | 'RUNNING' | 'FINISHED' | 'FAILED' | 'KILLED';
export type FinalStatus = 'UNDEFINED' | 'SUCCEEDED' | 'FAILED' | 'KILLED';

export interface YarnApp {
  id: string;
  user: string;
  name: string;
  queue: string;
  state: JobState;
  finalStatus: FinalStatus;
  progress: number;
  trackingUI: string;
  trackingUrl: string;
  diagnostics: string;
  clusterId: string;
  applicationType: string;
  applicationTags: string;
  startedTime: number;
  finishedTime: number;
  elapsedTime: number;
  amContainerLogs: string;
  amHostHttpAddress: string;
  allocatedMB: number;
  allocatedVCores: number;
  runningContainers: number;
  memorySeconds: number;
  vcoreSeconds: number;
}

export interface JobsApiResponse {
  apps: YarnApp[];
  isMockData: boolean;
  error?: string;
}
