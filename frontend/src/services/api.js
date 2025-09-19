import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const instancesService = {
  getInstances: async () => {
    const response = await apiClient.get('/instances');
    return response.data;
  },

  getInstance: async (instanceId) => {
    const response = await apiClient.get(`/instances/${instanceId}`);
    return response.data;
  },
};

export const logsService = {
  queryLogs: async (request) => {
    const response = await apiClient.post('/logs/query', request);
    return response.data;
  },

  getLogGroups: async (instanceId) => {
    const response = await apiClient.get(`/logs/groups/${instanceId}`);
    return response.data;
  },

  exportLogs: async (request) => {
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