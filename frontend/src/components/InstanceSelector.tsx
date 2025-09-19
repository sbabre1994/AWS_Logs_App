import React from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Tooltip,
} from '@chakra-ui/react';
import { EC2Instance } from '../types';

interface InstanceSelectorProps {
  instances: EC2Instance[];
  selectedInstanceId: string;
  onInstanceSelect: (instanceId: string) => void;
}

export const InstanceSelector: React.FC<InstanceSelectorProps> = ({
  instances,
  selectedInstanceId,
  onInstanceSelect,
}) => {
  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'running':
        return 'green';
      case 'stopped':
        return 'red';
      case 'pending':
        return 'yellow';
      case 'stopping':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state.toLowerCase()) {
      case 'running':
        return '🟢';
      case 'stopped':
        return '🔴';
      case 'pending':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const selectedInstance = instances.find(i => i.instanceId === selectedInstanceId);

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel fontSize="lg" fontWeight="semibold">
          Select EC2 Instance
        </FormLabel>
        <Select
          placeholder="Choose an instance to view logs..."
          value={selectedInstanceId}
          onChange={(e) => onInstanceSelect(e.target.value)}
          size="lg"
        >
          {instances.map((instance) => (
            <option key={instance.instanceId} value={instance.instanceId}>
              {instance.name} ({instance.instanceId}) - {instance.state}
            </option>
          ))}
        </Select>
      </FormControl>

      {selectedInstance && (
        <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <VStack spacing={3} align="start">
            <HStack>
              {getStateIcon(selectedInstance.state)}
              <Text fontWeight="semibold">{selectedInstance.name}</Text>
              <Badge colorScheme={getStateColor(selectedInstance.state)}>
                {selectedInstance.state}
              </Badge>
            </HStack>
            
            <HStack spacing={6} wrap="wrap">
              <Tooltip label="Instance ID">
                <Text fontSize="sm">
                  <Text as="span" fontWeight="semibold">ID:</Text> {selectedInstance.instanceId}
                </Text>
              </Tooltip>
              
              <Tooltip label="Instance Type">
                <Text fontSize="sm">
                  <Text as="span" fontWeight="semibold">Type:</Text> {selectedInstance.instanceType}
                </Text>
              </Tooltip>
              
              {selectedInstance.privateIpAddress && (
                <Tooltip label="Private IP">
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">Private IP:</Text> {selectedInstance.privateIpAddress}
                  </Text>
                </Tooltip>
              )}
              
              {selectedInstance.publicIpAddress && (
                <Tooltip label="Public IP">
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">Public IP:</Text> {selectedInstance.publicIpAddress}
                  </Text>
                </Tooltip>
              )}
            </HStack>
            
            <Text fontSize="sm" color="gray.600">
              <Text as="span" fontWeight="semibold">Launched:</Text>{' '}
              {new Date(selectedInstance.launchTime).toLocaleString()}
            </Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};