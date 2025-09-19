import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AWSLogsApp } from './components/AWSLogsApp';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AWSLogsApp />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;