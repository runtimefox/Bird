'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { QUERY_DEFAULTS } from '@/config/query.config';

export default function Provider({ children }: { children: React.ReactNode }) {
  // Lazy state, not a bare `new QueryClient()`: a re-render here would otherwise
  // hand down a fresh client and throw the whole cache away mid-session.
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: QUERY_DEFAULTS } }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
