import { useQuery, useMutation } from '@tanstack/react-query';
import { instancesService, logsService } from '../services/mockApi';

export const useInstances = () => {
  return useQuery({
    queryKey: ['instances'],
    queryFn: instancesService.getInstances,
  });
};

export const useInstance = (instanceId) => {
  return useQuery({
    queryKey: ['instances', instanceId],
    queryFn: () => instancesService.getInstance(instanceId),
    enabled: !!instanceId,
  });
};

export const useLogs = (request) => {
  return useQuery({
    queryKey: ['logs', request],
    queryFn: () => logsService.queryLogs(request),
    enabled: !!request.instanceId,
  });
};

export const useLogGroups = (instanceId) => {
  return useQuery({
    queryKey: ['logGroups', instanceId],
    queryFn: () => logsService.getLogGroups(instanceId),
    enabled: !!instanceId,
  });
};

export const useExportLogs = () => {
  return useMutation({
    mutationFn: (request) => logsService.exportLogs(request),
    onSuccess: () => {
      // Could show success toast here
    },
    onError: (error) => {
      console.error('Export failed:', error);
      // Could show error toast here
    },
  });
};