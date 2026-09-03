import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chat.service';
import type { IMessage } from '@/types/chat.type';
import type { AxiosResponse } from 'axios';
import { io } from 'socket.io-client';
import { useGetProfile } from './useGetProfile';

type MessagesResponse = AxiosResponse<IMessage[]>;

export const useChat = (conversationId: string, otherUserId?: string) => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const queryClient = useQueryClient();
  const { data: user } = useGetProfile();
  const userId = user?.data.id;

  const { data } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (!conversationId || !userId) return;

    const s = io(`${process.env.NEXT_PUBLIC_SOCKET_URL!}`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      query: { userId },
    });

    socketRef.current = s;
    s.emit('joinConversation', conversationId);

    s.on('newMessage', (message: IMessage) => {
      queryClient.setQueryData<MessagesResponse>(['messages', conversationId], (prev) => {
        if (!prev) return prev;
        if (prev.data.some((m) => m.id === message.id)) return prev;
        return { ...prev, data: [...prev.data, message] };
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    s.on('typing', (payload: { userId: string; isTyping: boolean }) => {
      if (payload.userId === otherUserId) {
        setIsTyping(payload.isTyping);
      }
    });
    s.on('userOnline', (id: string) => {
      if (id === otherUserId) setIsOnline(true);
    });
    s.on('userOffline', (id: string) => {
      if (id === otherUserId) setIsOnline(false);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, userId, otherUserId, queryClient]);

  const sendMessage = useCallback(
    (senderId: string, content: string) => {
      socketRef.current?.emit('sendMessage', { conversationId, senderId, content });
    },
    [conversationId],
  );

  const sendTyping = useCallback(
    (typing: boolean) => {
      socketRef.current?.emit('typing', { conversationId, userId, isTyping: typing });
    },
    [conversationId, userId],
  );

  return { messages: data?.data ?? [], sendMessage, sendTyping, isTyping, isOnline };
};
