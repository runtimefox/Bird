import { describe, expect, it } from 'bun:test';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

const DELAY = 30;

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('query', DELAY));

    expect(result.current).toBe('query');
  });

  it('holds the previous value until the delay elapses', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, DELAY), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    expect(result.current).toBe('a');

    await waitFor(() => expect(result.current).toBe('b'));
  });

  it('settles on the last value when it changes rapidly', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, DELAY), {
      initialProps: { value: '' },
    });

    rerender({ value: 'i' });
    rerender({ value: 'iv' });
    rerender({ value: 'ivan' });

    expect(result.current).toBe('');
    await waitFor(() => expect(result.current).toBe('ivan'));
  });

  it('works for non-string values', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, DELAY), {
      initialProps: { value: 0 },
    });

    rerender({ value: 42 });

    await waitFor(() => expect(result.current).toBe(42));
  });
});
