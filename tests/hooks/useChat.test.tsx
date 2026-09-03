import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { act, waitFor } from '@testing-library/react';
import type { IMessage } from '@/types/chat.type';
import { makeMessage, makeUser } from '../helpers/fixtures';
import { renderHookWithQuery } from '../helpers/query-wrapper';

const handlers = new Map<string, (payload: unknown) => void>();

const socket = {
  on: mock((event: string, handler: (payload: unknown) => void) => {
    handlers.set(event, handler);
  }),
  emit: mock<(event: string, payload?: unknown) => void>(() => undefined),
  disconnect: mock<() => void>(() => undefined),
};

const io = mock(() => socket);

mock.module('socket.io-client', () => ({ io }));

const { useChat } = await import('@/hooks/useChat');

const serveHistory = (history: IMessage[]) =>
  axiosAuthMock.get.mockImplementation(async (...args: unknown[]) => {
    const url = args[0] as string;
    if (url.startsWith('/chat/messages')) return axiosResponse(history);
    return axiosResponse(makeUser({ id: 'u1' }));
  });

const serveHistoryWithPendingProfile = (history: IMessage[]) =>
  axiosAuthMock.get.mockImplementation(async (...args: unknown[]) => {
    const url = args[0] as string;
    if (url.startsWith('/chat/messages')) return axiosResponse(history);
    return new Promise(() => {});
  });

const emit = (event: string, payload: unknown) => act(() => handlers.get(event)?.(payload));

describe('useChat', () => {
  beforeEach(() => {
    resetAxiosMocks();
    handlers.clear();
    io.mockClear();
    socket.emit.mockClear();
    socket.disconnect.mockClear();
  });

  it('joins the conversation once both the id and the profile are known', async () => {
    serveHistory([]);
    renderHookWithQuery(() => useChat('conv1', 'u2'));

    await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
    expect(socket.emit).toHaveBeenCalledWith('joinConversation', 'conv1');
  });

  it('does not open a socket while the profile is still unknown', async () => {
    serveHistoryWithPendingProfile([]);
    renderHookWithQuery(() => useChat('conv1', 'u2'));

    await waitFor(() => expect(axiosAuthMock.get).toHaveBeenCalled());
    expect(io).not.toHaveBeenCalled();
  });

  it('does not open a socket without a conversation', async () => {
    serveHistory([]);
    renderHookWithQuery(() => useChat('', 'u2'));

    await waitFor(() => expect(axiosAuthMock.get).toHaveBeenCalled());
    expect(io).not.toHaveBeenCalled();
  });

  it('returns the fetched history', async () => {
    serveHistory([makeMessage({ id: 'm1' })]);
    const { result } = renderHookWithQuery(() => useChat('conv1', 'u2'));

    await waitFor(() => expect(result.current.messages).toHaveLength(1));
  });

  it('appends a live message to the history', async () => {
    serveHistory([makeMessage({ id: 'm1' })]);
    const { result } = renderHookWithQuery(() => useChat('conv1', 'u2'));

    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    emit('newMessage', makeMessage({ id: 'm2', content: 'Live one' }));

    await waitFor(() => expect(result.current.messages).toHaveLength(2));
    expect(result.current.messages[1].content).toBe('Live one');
  });

  it('ignores a live message the history already carries', async () => {
    serveHistory([makeMessage({ id: 'm1' })]);
    const { result } = renderHookWithQuery(() => useChat('conv1', 'u2'));

    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    emit('newMessage', makeMessage({ id: 'm1' }));

    expect(result.current.messages).toHaveLength(1);
  });

  it('keeps live messages inside the conversation they arrived for', async () => {
    serveHistory([]);
    const { result, client } = renderHookWithQuery(() => useChat('conv1', 'u2'));

    await waitFor(() => expect(io).toHaveBeenCalled());
    emit('newMessage', makeMessage({ id: 'm2' }));
    await waitFor(() => expect(result.current.messages).toHaveLength(1));

    expect(client.getQueryData(['messages', 'conv2'])).toBeUndefined();
  });

  it('tracks typing and presence for the other person only', async () => {
    serveHistory([]);
    const { result } = renderHookWithQuery(() => useChat('conv1', 'u2'));

    await waitFor(() => expect(io).toHaveBeenCalled());

    emit('typing', { userId: 'u3', isTyping: true });
    expect(result.current.isTyping).toBe(false);

    emit('typing', { userId: 'u2', isTyping: true });
    expect(result.current.isTyping).toBe(true);

    emit('userOnline', 'u2');
    expect(result.current.isOnline).toBe(true);

    emit('userOffline', 'u2');
    expect(result.current.isOnline).toBe(false);
  });

  it('tears the socket down on unmount', async () => {
    serveHistory([]);
    const { unmount } = renderHookWithQuery(() => useChat('conv1', 'u2'));

    await waitFor(() => expect(io).toHaveBeenCalled());
    unmount();

    expect(socket.disconnect).toHaveBeenCalledTimes(1);
  });
});
