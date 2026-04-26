import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { io, type Socket } from 'socket.io-client';
import { chatService } from '@/services/chat.service';
import type { IMessage } from '@/types/chat.type';

export const useChat = (conversationId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { data } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (data?.data) setMessages(data.data);
  }, [data]);

  useEffect(() => {
    if (!conversationId) return;

    const s = io(process.env.NEXT_PUBLIC_API_URL!, {
      withCredentials: true,
      path: '/socket.io',
    });

    s.emit('joinConversation', conversationId);

    s.on('newMessage', (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [conversationId]);

  const sendMessage = (senderId: string, content: string) => {
    socket?.emit('sendMessage', { conversationId, senderId, content });
  };

  return { messages, sendMessage };
};
