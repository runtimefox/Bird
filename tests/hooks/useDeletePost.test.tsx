import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { resetToastMocks, toastError, toastSuccess } from '../helpers/toast-mock';
import { act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { QueryClient } from '@tanstack/react-query';
import { makePost } from '../helpers/fixtures';
import { renderHookWithQuery } from '../helpers/query-wrapper';

const { useDeletePost } = await import('@/hooks/useDeletePost');

const cachingClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, staleTime: 0 },
      mutations: { retry: false },
    },
  });

describe('useDeletePost', () => {
  beforeEach(() => {
    resetAxiosMocks();
    resetToastMocks();
  });

  it('deletes the post by id', async () => {
    const { result } = renderHookWithQuery(() => useDeletePost());

    act(() => result.current.deletePost('p1'));

    await waitFor(() => expect(axiosAuthMock.delete).toHaveBeenCalledWith('/posts/p1'));
  });

  it('invalidates every post list, not just the profile one', async () => {
    const { result, client } = renderHookWithQuery(() => useDeletePost());
    const invalidate = mock(client.invalidateQueries.bind(client));
    client.invalidateQueries = invalidate;

    act(() => result.current.deletePost('p1'));

    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ['posts'] }));
  });

  it('reaches the feed and the profile list through the shared prefix', async () => {
    const { result, client } = renderHookWithQuery(() => useDeletePost(), cachingClient());
    client.setQueryData(['posts', 'For you'], axiosResponse({ data: [makePost()], total: 1 }));
    client.setQueryData(['posts', 'user', 'u1'], axiosResponse([makePost()]));

    act(() => result.current.deletePost('p1'));

    await waitFor(() => {
      expect(client.getQueryState(['posts', 'For you'])?.isInvalidated).toBe(true);
      expect(client.getQueryState(['posts', 'user', 'u1'])?.isInvalidated).toBe(true);
    });
  });

  it('drops the cached detail view of the deleted post', async () => {
    const { result, client } = renderHookWithQuery(() => useDeletePost(), cachingClient());
    client.setQueryData(['post', 'p1'], axiosResponse(makePost()));
    expect(client.getQueryData(['post', 'p1'])).toBeDefined();

    act(() => result.current.deletePost('p1'));

    await waitFor(() => expect(client.getQueryData(['post', 'p1'])).toBeUndefined());
  });

  it('toasts on success', async () => {
    const { result } = renderHookWithQuery(() => useDeletePost());

    act(() => result.current.deletePost('p1'));

    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith('Post deleted!'));
  });

  it('surfaces the api message when the delete fails', async () => {
    axiosAuthMock.delete.mockRejectedValueOnce({
      response: { data: { message: 'Not your post' } },
    });
    const { result } = renderHookWithQuery(() => useDeletePost());

    act(() => result.current.deletePost('p1'));

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Not your post'));
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
