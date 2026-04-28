import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chat.service';
import type { IMessage } from '@/types/chat.type';
import { io } from 'socket.io-client';
import { useGetProfile } from './useGetProfile';

export const useChat = (conversationId: string, otherUserId?: string) => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const queryClient = useQueryClient();
  const { data: user } = useGetProfile();
  const { data } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId,
  });

  const allMessages = [...(data?.data ?? []), ...messages];

  useEffect(() => {
    if (!conversationId && !user?.data.id) return;

    const s = io(`${process.env.NEXT_PUBLIC_SOCKET_URL!}/chat/socket.io`, {
      withCredentials: true,
      transports: ['polling'],
      query: { userId: user?.data.id },
    });

    socketRef.current = s;
    s.emit('joinConversation', conversationId);

    s.on('newMessage', (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    s.on('typing', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === otherUserId) {
        setIsTyping(data.isTyping);
      }
    });
    s.on('userOnline', (userId: string) => {
      if (userId === otherUserId) {
        setIsOnline(true);
      }
    });
    s.on('userOffline', (userId: string) => {
      if (userId === otherUserId) {
        setIsOnline(false);
      }
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, user?.data.id]);

  const sendMessage = (senderId: string, content: string) => {
    socketRef.current?.emit('sendMessage', { conversationId, senderId, content });
  };

  const sendTyping = (typing: boolean) => {
    socketRef.current?.emit('typing', { conversationId, userId: user?.data.id, isTyping: typing });
  };

  return { messages: allMessages, sendMessage, sendTyping, isTyping, isOnline };
};
