export interface EC2Instance {
  instanceId: string;
  name: string;
  state: string;
  instanceType: string;
  launchTime: string;
  privateIpAddress: string;
  publicIpAddress: string;
}

export interface LogEntry {
  eventId: string;
  timestamp: string;
  message: string;
  logLevel: string;
  logGroup: string;
  logStream: string;
  ingestionTime: number;
  additionalData?: Record<string, any>;
}

export interface LogQueryRequest {
  instanceId: string;
  startTime?: string;
  endTime?: string;
  logLevel?: string;
  searchKeyword?: string;
  pageSize?: number;
  nextToken?: string;
  isLiveMode?: boolean;
}

export interface LogQueryResponse {
  logs: LogEntry[];
  nextToken?: string;
  hasMoreData: boolean;
  totalCount: number;
  errorMessage?: string;
}

export interface ExportRequest {
  instanceId: string;
  startTime?: string;
  endTime?: string;
  logLevel?: string;
  searchKeyword?: string;
  format: 'CSV' | 'TXT' | 'JSON';
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';