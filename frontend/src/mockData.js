// Mock data for development and demonstration
export const mockInstances = [
  {
    instanceId: 'i-1234567890abcdef0',
    name: 'Web Server 1',
    state: 'running',
    instanceType: 't3.medium',
    launchTime: '2024-01-15T08:30:00Z',
    privateIpAddress: '10.0.1.100',
    publicIpAddress: '54.123.456.789'
  },
  {
    instanceId: 'i-0987654321fedcba0',
    name: 'Database Server',
    state: 'running',
    instanceType: 'm5.large',
    launchTime: '2024-01-10T14:20:00Z',
    privateIpAddress: '10.0.1.200',
    publicIpAddress: ''
  },
  {
    instanceId: 'i-abcdef1234567890',
    name: 'Load Balancer',
    state: 'stopped',
    instanceType: 't3.small',
    launchTime: '2024-01-20T09:15:00Z',
    privateIpAddress: '10.0.1.50',
    publicIpAddress: '52.987.654.321'
  },
  {
    instanceId: 'i-fedcba0987654321',
    name: 'Backup Server',
    state: 'pending',
    instanceType: 't3.micro',
    launchTime: '2024-01-25T16:45:00Z',
    privateIpAddress: '10.0.1.75',
    publicIpAddress: ''
  }
];

export const mockLogs = [
  {
    eventId: 'event-001',
    timestamp: '2024-01-25T10:30:15.123Z',
    message: 'Application started successfully on port 8080',
    logLevel: 'INFO',
    logGroup: '/aws/ec2/web-server',
    logStream: 'i-1234567890abcdef0/application.log',
    ingestionTime: 1706175015123,
    additionalData: {
      pid: 1234,
      version: '2.1.0'
    }
  },
  {
    eventId: 'event-002',
    timestamp: '2024-01-25T10:32:20.456Z',
    message: 'Database connection established to mysql://db-server:3306/myapp',
    logLevel: 'INFO',
    logGroup: '/aws/ec2/web-server',
    logStream: 'i-1234567890abcdef0/application.log',
    ingestionTime: 1706175140456,
    additionalData: {
      connectionPool: 'default',
      maxConnections: 100
    }
  },
  {
    eventId: 'event-003',
    timestamp: '2024-01-25T10:35:45.789Z',
    message: 'Failed to process user request: Invalid authentication token',
    logLevel: 'ERROR',
    logGroup: '/aws/ec2/web-server',
    logStream: 'i-1234567890abcdef0/error.log',
    ingestionTime: 1706175345789,
    additionalData: {
      userId: 'user123',
      endpoint: '/api/users/profile',
      errorCode: 'AUTH_001'
    }
  },
  {
    eventId: 'event-004',
    timestamp: '2024-01-25T10:36:10.012Z',
    message: 'High memory usage detected: 85% of available memory in use',
    logLevel: 'WARN',
    logGroup: '/aws/ec2/web-server',
    logStream: 'i-1234567890abcdef0/system.log',
    ingestionTime: 1706175370012,
    additionalData: {
      memoryUsage: '85%',
      totalMemory: '8GB',
      usedMemory: '6.8GB'
    }
  },
  {
    eventId: 'event-005',
    timestamp: '2024-01-25T10:38:30.345Z',
    message: 'Processing batch job: customer-data-export-20240125',
    logLevel: 'INFO',
    logGroup: '/aws/ec2/web-server',
    logStream: 'i-1234567890abcdef0/batch.log',
    ingestionTime: 1706175510345,
    additionalData: {
      jobId: 'job-20240125-001',
      batchSize: 5000,
      estimatedDuration: '15 minutes'
    }
  },
  {
    eventId: 'event-006',
    timestamp: '2024-01-25T10:40:15.678Z',
    message: 'Debug: User authentication flow started for user session',
    logLevel: 'DEBUG',
    logGroup: '/aws/ec2/web-server',
    logStream: 'i-1234567890abcdef0/debug.log',
    ingestionTime: 1706175615678,
    additionalData: {
      sessionId: 'sess_abc123def456',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ipAddress: '192.168.1.100'
    }
  },
  {
    eventId: 'event-007',
    timestamp: '2024-01-25T10:42:00.901Z',
    message: 'FATAL: Database connection lost, attempting reconnection',
    logLevel: 'FATAL',
    logGroup: '/aws/ec2/web-server',
    logStream: 'i-1234567890abcdef0/error.log',
    ingestionTime: 1706175720901,
    additionalData: {
      connectionId: 'conn_789',
      lastQuery: 'SELECT * FROM users WHERE id = ?',
      retryAttempt: 1
    }
  },
  {
    eventId: 'event-008',
    timestamp: '2024-01-25T10:43:30.234Z',
    message: 'Health check endpoint /health responded with status 200',
    logLevel: 'INFO',
    logGroup: '/aws/ec2/web-server',
    logStream: 'i-1234567890abcdef0/access.log',
    ingestionTime: 1706175810234,
    additionalData: {
      responseTime: '45ms',
      statusCode: 200,
      endpoint: '/health'
    }
  }
];

export const mockLogResponse = {
  logs: mockLogs,
  nextToken: 'next-token-123',
  hasMoreData: true,
  totalCount: mockLogs.length,
  errorMessage: null
};