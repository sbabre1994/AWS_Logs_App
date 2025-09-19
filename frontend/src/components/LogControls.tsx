import React, { useState } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ButtonGroup,
  Tooltip,
  Text,
  useToast,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { LogQueryRequest, ExportRequest, LogLevel } from '../types';
import { useExportLogs } from '../hooks/useApi';

interface LogControlsProps {
  instanceId: string;
  onQueryChange: (query: Partial<LogQueryRequest>) => void;
  currentQuery: LogQueryRequest;
}

export const LogControls: React.FC<LogControlsProps> = ({
  instanceId,
  onQueryChange,
  currentQuery,
}) => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30);
  const [filters, setFilters] = useState({
    startTime: '',
    endTime: '',
    logLevel: '',
    searchKeyword: '',
  });

  const exportMutation = useExportLogs();
  const toast = useToast();

  const logLevels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onQueryChange(newFilters);
  };

  const handleRefresh = () => {
    onQueryChange({ ...currentQuery, nextToken: undefined });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      startTime: '',
      endTime: '',
      logLevel: '',
      searchKeyword: '',
    };
    setFilters(clearedFilters);
    onQueryChange(clearedFilters);
  };

  const handleExport = async (format: 'CSV' | 'TXT' | 'JSON') => {
    try {
      const exportRequest: ExportRequest = {
        instanceId,
        format,
        startTime: filters.startTime || undefined,
        endTime: filters.endTime || undefined,
        logLevel: filters.logLevel || undefined,
        searchKeyword: filters.searchKeyword || undefined,
      };

      await exportMutation.mutateAsync(exportRequest);
      
      toast({
        title: 'Export successful',
        description: `Logs exported as ${format}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export logs. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    onQueryChange({ isLiveMode: !autoRefresh });
  };

  // Get current date for max date input
  const now = new Date();
  const maxDate = now.toISOString().slice(0, 16);

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Flex align="center">
        <Text fontSize="lg" fontWeight="semibold">
          Log Controls
        </Text>
        <Spacer />
        <HStack spacing={2}>
          <Tooltip label={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}>
          <Tooltip label={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}>
            <Button
              size="sm"
              leftIcon={autoRefresh ? <Text>⏸️</Text> : <Text>▶️</Text>}
              colorScheme={autoRefresh ? 'red' : 'green'}
              variant={autoRefresh ? 'solid' : 'outline'}
              onClick={toggleAutoRefresh}
            >
              {autoRefresh ? 'Live' : 'Manual'}
            </Button>
          </Tooltip>
          </Tooltip>
          
          <Tooltip label="Refresh logs">
            <Button
              size="sm"
              leftIcon={<Text>🔄</Text>}
              onClick={handleRefresh}
              variant="outline"
            >
              Refresh
            </Button>
          </Tooltip>
        </HStack>
      </Flex>

      {/* Date and Time Filters */}
      <HStack spacing={4} wrap="wrap">
        <FormControl maxW="200px">
          <FormLabel fontSize="sm">Start Time</FormLabel>
          <Input
            type="datetime-local"
            value={filters.startTime}
            max={maxDate}
            onChange={(e) => handleFilterChange('startTime', e.target.value)}
            size="sm"
          />
        </FormControl>

        <FormControl maxW="200px">
          <FormLabel fontSize="sm">End Time</FormLabel>
          <Input
            type="datetime-local"
            value={filters.endTime}
            max={maxDate}
            onChange={(e) => handleFilterChange('endTime', e.target.value)}
            size="sm"
          />
        </FormControl>

        <FormControl maxW="150px">
          <FormLabel fontSize="sm">Log Level</FormLabel>
          <Select
            value={filters.logLevel}
            onChange={(e) => handleFilterChange('logLevel', e.target.value)}
            size="sm"
            placeholder="All levels"
          >
            {logLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      {/* Search and Actions */}
      <HStack spacing={4} wrap="wrap">
        <FormControl flex="1" minW="250px">
          <FormLabel fontSize="sm">Search Keywords</FormLabel>
          <HStack>
            <Text>🔍</Text>
            <Input
              placeholder="Search in log messages..."
              value={filters.searchKeyword}
              onChange={(e) => handleFilterChange('searchKeyword', e.target.value)}
              size="sm"
            />
          </HStack>
        </FormControl>

        <FormControl maxW="120px">
          <FormLabel fontSize="sm">Page Size</FormLabel>
          <NumberInput
            value={currentQuery.pageSize}
            onChange={(_, value) => onQueryChange({ pageSize: value || 100 })}
            min={10}
            max={1000}
            size="sm"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </HStack>

      {/* Auto-refresh settings */}
      {autoRefresh && (
        <HStack spacing={4}>
          <FormControl maxW="150px">
            <FormLabel fontSize="sm">Refresh Interval (seconds)</FormLabel>
            <NumberInput
              value={autoRefreshInterval}
              onChange={(_, value) => setAutoRefreshInterval(value || 30)}
              min={5}
              max={300}
              size="sm"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </HStack>
      )}

      {/* Action Buttons */}
      <HStack spacing={4} justify="space-between" wrap="wrap">
        <ButtonGroup size="sm" variant="outline">
          <Button
            leftIcon={<Text>🗑️</Text>}
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </ButtonGroup>

        <ButtonGroup size="sm">
          <Button
            leftIcon={<Text>💾</Text>}
            onClick={() => handleExport('CSV')}
            isLoading={exportMutation.isPending}
            colorScheme="blue"
          >
            CSV
          </Button>
          <Button
            leftIcon={<Text>💾</Text>}
            onClick={() => handleExport('JSON')}
            isLoading={exportMutation.isPending}
            colorScheme="green"
          >
            JSON
          </Button>
          <Button
            leftIcon={<Text>💾</Text>}
            onClick={() => handleExport('TXT')}
            isLoading={exportMutation.isPending}
            colorScheme="purple"
          >
            TXT
          </Button>
        </ButtonGroup>
      </HStack>
    </VStack>
  );
};