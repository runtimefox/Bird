import { axiosAuthMock, resetAxiosMocks } from '../helpers/axios-mock';
import { resetToastMocks, toastSuccess } from '../helpers/toast-mock';
import { act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { renderHookWithQuery } from '../helpers/query-wrapper';

const { useComments } = await import('@/hooks/useComments');

const noop = () => {};

describe('useComments', () => {
  beforeEach(() => {
    resetAxiosMocks();
    resetToastMocks();
  });

  it('starts with an empty draft', () => {
    const { result } = renderHookWithQuery(() => useComments('p1', noop));

    expect(result.current.content).toBe('');
  });

  it('posts the current draft against the post id', async () => {
    const { result } = renderHookWithQuery(() => useComments('p1', noop));

    act(() => result.current.setContent('Nice post'));
    await waitFor(() => expect(result.current.content).toBe('Nice post'));
    act(() => result.current.mutate());

    await waitFor(() =>
      expect(axiosAuthMock.post).toHaveBeenCalledWith('/comments/posts/p1/comments', {
        postId: 'p1',
        content: 'Nice post',
      }),
    );
  });

  it('clears the draft, toasts and closes the modal on success', async () => {
    const onClose = mock(() => {});
    const { result } = renderHookWithQuery(() => useComments('p1', onClose));

    act(() => result.current.setContent('Nice post'));
    act(() => result.current.mutate());

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(result.current.content).toBe('');
    expect(toastSuccess).toHaveBeenCalledWith('Reply posted!');
  });

  it('invalidates the post, its comments and the feed', async () => {
    const { result, client } = renderHookWithQuery(() => useComments('p1', noop));
    const invalidate = mock(client.invalidateQueries.bind(client));
    client.invalidateQueries = invalidate;

    act(() => result.current.mutate());

    await waitFor(() => expect(invalidate).toHaveBeenCalledTimes(3));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['post', 'p1'] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['comments', 'p1'] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['posts'] });
  });

  it('keeps the draft and the modal open when the request fails', async () => {
    axiosAuthMock.post.mockRejectedValueOnce(new Error('boom'));
    const onClose = mock(() => {});
    const { result } = renderHookWithQuery(() => useComments('p1', onClose));

    act(() => result.current.setContent('Nice post'));
    act(() => result.current.mutate());

    await waitFor(() => expect(axiosAuthMock.post).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.content).toBe('Nice post');
  });
});
