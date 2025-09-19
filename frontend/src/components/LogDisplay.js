import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Spinner,
  Button,
  Code,
  Divider,
  Flex,
  Spacer,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  FormControl,
  FormLabel,
  Heading,
} from '@chakra-ui/react';
import { useLogs } from '../hooks/useApi';
import { format } from 'date-fns';

export const LogDisplay = ({ query }) => {
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [tableView, setTableView] = useState(false);
  
  const { data: logResponse, isLoading, error, refetch } = useLogs(query);

  const bgColor = 'gray.50';
  const borderColor = 'gray.200';

  // Auto-refresh logic
  useEffect(() => {
    let interval;
    
    if (query.isLiveMode) {
      interval = setInterval(() => {
        refetch();
      }, 30000); // Refresh every 30 seconds in live mode
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [query.isLiveMode, refetch]);

  const getLogLevelColor = (level) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return 'red';
      case 'WARN':
      case 'WARNING':
        return 'orange';
      case 'DEBUG':
        return 'purple';
      case 'TRACE':
        return 'gray';
      case 'FATAL':
        return 'red';
      default:
        return 'blue';
    }
  };

  const getLogLevelIcon = (level) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return '❌';
      case 'WARN':
      case 'WARNING':
        return '⚠️';
      case 'DEBUG':
        return '🐛';
      case 'FATAL':
        return '💀';
      default:
        return 'ℹ️';
    }
  };

  const toggleLogExpansion = (eventId) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedLogs(newExpanded);
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss.SSS');
    } catch {
      return timestamp;
    }
  };

  if (isLoading) {
    return (
      <VStack spacing={4} align="center" justify="center" minH="300px">
        <Spinner size="lg" />
        <Text>Loading logs...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.100" borderRadius="md" borderWidth={1} borderColor="red.200">
        <Heading size="md" color="red.600" mb={2}>Failed to load logs!</Heading>
        <Box color="red.500">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </Box>
      </Box>
    );
  }

  if (!logResponse || logResponse.logs.length === 0) {
    return (
      <Box p={4} bg="blue.50" borderRadius="md" borderWidth={1} borderColor="blue.200">
        <Heading size="md" color="blue.600" mb={2}>No logs found</Heading>
        <Box color="blue.500">
          No logs match your current filters. Try adjusting the time range or removing filters.
        </Box>
      </Box>
    );
  }

  if (logResponse.errorMessage) {
    return (
      <Box p={4} bg="red.100" borderRadius="md" borderWidth={1} borderColor="red.200">
        <Heading size="md" color="red.600" mb={2}>Error loading logs</Heading>
        <Box color="red.500">{logResponse.errorMessage}</Box>
      </Box>
    );
  }

  const LogCardView = () => (
    <VStack spacing={4} align="stretch">
      {logResponse.logs.map((log) => {
        const isExpanded = expandedLogs.has(log.eventId);
        
        return (
          <Box
            key={log.eventId}
            p={4}
            borderWidth={1}
            borderRadius="md"
            borderColor={borderColor}
            bg={bgColor}
            _hover={{ shadow: 'md' }}
            transition="all 0.2s"
          >
            <VStack spacing={3} align="stretch">
              {/* Header */}
              <Flex align="center">
                <HStack spacing={3}>
                  <Text fontSize="lg">{getLogLevelIcon(log.logLevel)}</Text>
                  <Badge colorScheme={getLogLevelColor(log.logLevel)} size="sm">
                    {log.logLevel}
                  </Badge>
                  <Text fontSize="sm" color="gray.500">
                    {formatTimestamp(log.timestamp)}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {log.logGroup} / {log.logStream}
                  </Text>
                </HStack>
                <Spacer />
                <Tooltip label={isExpanded ? 'Collapse' : 'Expand'}>
                  <Button
                    size="xs"
                    variant="ghost"
                    leftIcon={<Text>{isExpanded ? '🔽' : '▶️'}</Text>}
                    onClick={() => toggleLogExpansion(log.eventId)}
                  >
                    {isExpanded ? 'Less' : 'More'}
                  </Button>
                </Tooltip>
              </Flex>

              {/* Message Preview */}
              <Box>
                <Text fontSize="sm" noOfLines={isExpanded ? undefined : 2}>
                  {log.message}
                </Text>
              </Box>

              {/* Expanded Details */}
              {isExpanded && (
                <VStack spacing={3} align="stretch" pt={3} borderTopWidth={1} borderColor={borderColor}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" mb={2}>Full Message:</Text>
                    <Code p={3} borderRadius="md" fontSize="xs" whiteSpace="pre-wrap" display="block">
                      {log.message}
                    </Code>
                  </Box>
                  
                  <HStack spacing={4} fontSize="xs" color="gray.500">
                    <Text><strong>Event ID:</strong> {log.eventId}</Text>
                    <Text><strong>Ingestion:</strong> {new Date(log.ingestionTime).toLocaleString()}</Text>
                  </HStack>

                  {log.additionalData && Object.keys(log.additionalData).length > 0 && (
                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" mb={2}>Additional Data:</Text>
                      <Code p={3} borderRadius="md" fontSize="xs" display="block">
                        {JSON.stringify(log.additionalData, null, 2)}
                      </Code>
                    </Box>
                  )}
                </VStack>
              )}
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );

  const LogTableView = () => (
    <Box overflowX="auto">
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>Level</Th>
            <Th>Timestamp</Th>
            <Th>Source</Th>
            <Th>Message</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {logResponse.logs.map((log) => (
            <Tr key={log.eventId}>
              <Td>
                <HStack>
                  <Text fontSize="lg">{getLogLevelIcon(log.logLevel)}</Text>
                  <Badge colorScheme={getLogLevelColor(log.logLevel)} size="sm">
                    {log.logLevel}
                  </Badge>
                </HStack>
              </Td>
              <Td fontSize="xs">{formatTimestamp(log.timestamp)}</Td>
              <Td fontSize="xs">{log.logStream}</Td>
              <Td>
                <Text fontSize="sm" noOfLines={2}>
                  {log.message}
                </Text>
              </Td>
              <Td>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => toggleLogExpansion(log.eventId)}
                >
                  View
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );

  return (
    <VStack spacing={4} align="stretch">
      {/* Controls */}
      <Flex align="center">
        <HStack spacing={4}>
          <Text fontWeight="semibold">
            {logResponse.totalCount} logs found
          </Text>
          {query.isLiveMode && (
            <Badge colorScheme="green" variant="solid">
              Live Mode
            </Badge>
          )}
        </HStack>
        
        <Spacer />
        
        <FormControl display="flex" alignItems="center" width="auto">
          <FormLabel htmlFor="table-view" mb="0" fontSize="sm">
            Table View
          </FormLabel>
          <Switch
            id="table-view"
            isChecked={tableView}
            onChange={(e) => setTableView(e.target.checked)}
          />
        </FormControl>
      </Flex>

      <Divider />

      {/* Logs Display */}
      {tableView ? <LogTableView /> : <LogCardView />}

      {/* Load More */}
      {logResponse.hasMoreData && (
        <Box textAlign="center" pt={4}>
          <Button
            variant="outline"
            onClick={() => {
              // This would typically load more data
              // For now, just refresh with the next token
            }}
          >
            Load More
          </Button>
        </Box>
      )}
    </VStack>
  );
};