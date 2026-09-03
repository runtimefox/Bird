import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

const wrapper = (client: QueryClient) =>
  function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

export const renderWithQuery = (ui: ReactElement, client = createTestQueryClient()) => ({
  client,
  ...render(ui, { wrapper: wrapper(client) }),
});

export const renderHookWithQuery = <TResult,>(
  hook: () => TResult,
  client = createTestQueryClient(),
) => ({
  client,
  ...renderHook(hook, { wrapper: wrapper(client) }),
});
