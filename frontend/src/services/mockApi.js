import { mockInstances, mockLogResponse } from '../mockData';

// Mock API service for demonstration
export const mockApiService = {
  getInstances: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockInstances;
  },

  getInstance: async (instanceId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const instance = mockInstances.find(i => i.instanceId === instanceId);
    if (!instance) {
      throw new Error('Instance not found');
    }
    return instance;
  },

  queryLogs: async (request) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter logs based on request
    let filteredLogs = mockLogResponse.logs;
    
    if (request.logLevel) {
      filteredLogs = filteredLogs.filter(log => 
        log.logLevel.toLowerCase() === request.logLevel.toLowerCase()
      );
    }
    
    if (request.searchKeyword) {
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(request.searchKeyword.toLowerCase())
      );
    }
    
    if (request.startTime) {
      const startTime = new Date(request.startTime);
      filteredLogs = filteredLogs.filter(log =>
        new Date(log.timestamp) >= startTime
      );
    }
    
    if (request.endTime) {
      const endTime = new Date(request.endTime);
      filteredLogs = filteredLogs.filter(log =>
        new Date(log.timestamp) <= endTime
      );
    }
    
    // Pagination
    const pageSize = request.pageSize || 100;
    const startIndex = 0; // For simplicity, always start from 0
    const endIndex = Math.min(startIndex + pageSize, filteredLogs.length);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
    
    return {
      logs: paginatedLogs,
      nextToken: endIndex < filteredLogs.length ? 'next-token' : null,
      hasMoreData: endIndex < filteredLogs.length,
      totalCount: filteredLogs.length,
      errorMessage: null
    };
  },

  getLogGroups: async (instanceId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      '/aws/ec2/web-server',
      '/aws/ec2/system',
      '/aws/ec2/application',
      '/aws/ec2/error',
      '/aws/ec2/access'
    ];
  },

  exportLogs: async (request) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get filtered logs
    const logResponse = await mockApiService.queryLogs(request);
    
    let content = '';
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (request.format) {
      case 'CSV':
        content = 'Timestamp,LogLevel,LogGroup,LogStream,Message\n';
        logResponse.logs.forEach(log => {
          content += `"${log.timestamp}","${log.logLevel}","${log.logGroup}","${log.logStream}","${log.message.replace(/"/g, '""')}"\n`;
        });
        break;
        
      case 'JSON':
        content = JSON.stringify(logResponse.logs, null, 2);
        break;
        
      case 'TXT':
        logResponse.logs.forEach(log => {
          content += `[${log.timestamp}] [${log.logLevel}] ${log.logGroup}/${log.logStream}: ${log.message}\n`;
        });
        break;
        
      default:
        throw new Error('Invalid export format');
    }
    
    // Create and download file
    const blob = new Blob([content], { 
      type: request.format === 'JSON' ? 'application/json' : 'text/plain' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs_${request.instanceId}_${timestamp}.${request.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

// Override the original API service with mock for development
export const instancesService = {
  getInstances: mockApiService.getInstances,
  getInstance: mockApiService.getInstance,
};

export const logsService = {
  queryLogs: mockApiService.queryLogs,
  getLogGroups: mockApiService.getLogGroups,
  exportLogs: mockApiService.exportLogs,
};