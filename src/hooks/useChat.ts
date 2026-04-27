import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chat.service';
import type { IMessage } from '@/types/chat.type';
import { io } from 'socket.io-client';

export const useChat = (conversationId: string) => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId,
  });

  const allMessages = [...(data?.data ?? []), ...messages];

  useEffect(() => {
    if (!conversationId) return;

    const s = io(`${process.env.NEXT_PUBLIC_SOCKET_URL!}/chat`, {
      withCredentials: true,
      transports: ['polling'],
    });

    socketRef.current = s;
    s.emit('joinConversation', conversationId);

    s.on('newMessage', (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [conversationId]);

  const sendMessage = (senderId: string, content: string) => {
    socketRef.current?.emit('sendMessage', { conversationId, senderId, content });
  };

  return { messages: allMessages, sendMessage };
};
