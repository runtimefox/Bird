import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../helpers/query-wrapper';

const { useLikes } = await import('@/hooks/useLikes');

describe('useLikes', () => {
  beforeEach(resetAxiosMocks);

  it('likes an unliked post', async () => {
    const { result } = renderHookWithQuery(() => useLikes('p1', false));

    result.current.mutate();

    await waitFor(() => expect(axiosAuthMock.post).toHaveBeenCalledWith('/posts/p1/like'));
    expect(axiosAuthMock.delete).not.toHaveBeenCalled();
  });

  it('unlikes an already liked post', async () => {
    const { result } = renderHookWithQuery(() => useLikes('p1', true));

    result.current.mutate();

    await waitFor(() => expect(axiosAuthMock.delete).toHaveBeenCalledWith('/posts/p1/unlike'));
    expect(axiosAuthMock.post).not.toHaveBeenCalled();
  });

  it('invalidates the feed and the single post so neither goes stale', async () => {
    const { result, client } = renderHookWithQuery(() => useLikes('p1', false));
    const invalidate = mock(client.invalidateQueries.bind(client));
    client.invalidateQueries = invalidate;

    result.current.mutate();

    await waitFor(() => expect(invalidate).toHaveBeenCalledTimes(2));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['posts'] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['post', 'p1'] });
  });

  it('reports pending while the request is in flight', async () => {
    let release: (() => void) | undefined;
    axiosAuthMock.post.mockImplementationOnce(
      () => new Promise((resolve) => (release = () => resolve(axiosResponse(undefined)))),
    );

    const { result } = renderHookWithQuery(() => useLikes('p1', false));
    expect(result.current.isPending).toBe(false);

    result.current.mutate();

    await waitFor(() => expect(result.current.isPending).toBe(true));
    release?.();
    await waitFor(() => expect(result.current.isPending).toBe(false));
  });

  it('leaves the cache alone when the request fails', async () => {
    axiosAuthMock.post.mockRejectedValueOnce(new Error('boom'));
    const { result, client } = renderHookWithQuery(() => useLikes('p1', false));
    const invalidate = mock(client.invalidateQueries.bind(client));
    client.invalidateQueries = invalidate;

    result.current.mutate();

    await waitFor(() => expect(axiosAuthMock.post).toHaveBeenCalled());
    expect(invalidate).not.toHaveBeenCalled();
  });
});
