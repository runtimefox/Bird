/**
 * Shared TanStack Query defaults. Without a `staleTime` every query refetches on
 * each window focus, which meant the whole dashboard re-requested itself every
 * time the tab regained focus.
 */
export const QUERY_DEFAULTS = {
  staleTime: 60 * 1000,
  retry: 1,
  refetchOnWindowFocus: false,
} as const;
