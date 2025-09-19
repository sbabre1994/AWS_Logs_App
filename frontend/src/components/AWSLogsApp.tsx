import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Card,
  Spinner,
} from '@chakra-ui/react';
import { InstanceSelector } from './InstanceSelector';
import { LogControls } from './LogControls';
import { LogDisplay } from './LogDisplay';
import { useInstances } from '../hooks/useApi';
import { LogQueryRequest } from '../types';

export const AWSLogsApp: React.FC = () => {
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>('');
  const [logQuery, setLogQuery] = useState<LogQueryRequest>({
    instanceId: '',
    pageSize: 100,
  });

  const { data: instances, isLoading, error } = useInstances();

  const bgColor = 'gray.50';

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor} py={8}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="center" justify="center" minH="50vh">
            <Spinner size="xl" />
            <Heading size="md">Loading AWS Resources...</Heading>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor} py={8}>
        <Container maxW="container.xl">
          <Box p={4} bg="red.100" borderRadius="md" borderWidth={1} borderColor="red.200">
            <Heading size="md" color="red.600" mb={2}>Failed to load instances!</Heading>
            <Box color="red.500">
              Please check your AWS configuration and ensure the backend is running.
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  const handleInstanceSelect = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setLogQuery(prev => ({ ...prev, instanceId }));
  };

  const handleQueryChange = (newQuery: Partial<LogQueryRequest>) => {
    setLogQuery(prev => ({ ...prev, ...newQuery }));
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={4}>
              AWS CloudWatch Log Management
            </Heading>
            <Heading size="md" color="gray.600" fontWeight="normal">
              Monitor and analyze EC2 instance logs in real-time
            </Heading>
          </Box>

          {/* Instance Selection */}
          <Card bg="white" shadow="lg">
            <Box p={6}>
              <InstanceSelector
                instances={instances || []}
                selectedInstanceId={selectedInstanceId}
                onInstanceSelect={handleInstanceSelect}
              />
            </Box>
          </Card>

          {/* Log Controls and Display */}
          {selectedInstanceId && (
            <>
              <Card bg="white" shadow="lg">
                <Box p={6}>
                  <LogControls
                    instanceId={selectedInstanceId}
                    onQueryChange={handleQueryChange}
                    currentQuery={logQuery}
                  />
                </Box>
              </Card>

              <Card bg="white" shadow="lg" minH="500px">
                <Box p={6}>
                  <LogDisplay query={logQuery} />
                </Box>
              </Card>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};