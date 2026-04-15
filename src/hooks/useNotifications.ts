'use client';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import type { INotification } from '@/types/notification.type';
import { useQueryClient } from '@tanstack/react-query';

export const useNotifications = (userId: string) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!userId) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      withCredentials: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
    });

    socket.emit('join', userId);

    socket.on('notification', (data: INotification) => {
      toast(`🔔 ${data.message}`, { duration: 4000 });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
};
