import axios from 'axios';
import { EC2Instance, LogQueryRequest, LogQueryResponse, ExportRequest } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const instancesService = {
  getInstances: async (): Promise<EC2Instance[]> => {
    const response = await apiClient.get('/instances');
    return response.data;
  },

  getInstance: async (instanceId: string): Promise<EC2Instance> => {
    const response = await apiClient.get(`/instances/${instanceId}`);
    return response.data;
  },
};

export const logsService = {
  queryLogs: async (request: LogQueryRequest): Promise<LogQueryResponse> => {
    const response = await apiClient.post('/logs/query', request);
    return response.data;
  },

  getLogGroups: async (instanceId: string): Promise<string[]> => {
    const response = await apiClient.get(`/logs/groups/${instanceId}`);
    return response.data;
  },

  exportLogs: async (request: ExportRequest): Promise<void> => {
    const response = await apiClient.post('/logs/export', request, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs_${request.instanceId}_${new Date().toISOString().split('T')[0]}.${request.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};