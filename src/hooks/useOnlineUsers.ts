import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useGetProfile } from './useGetProfile';

export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const { data: user } = useGetProfile();

  useEffect(() => {
    if (!user?.data.id) return;

    const s = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      withCredentials: true,
      transports: ['polling'],
      query: { userId: user.data.id },
    });

    socketRef.current = s;

    s.on('userOnline', (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    s.on('userOffline', (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [user?.data.id]);

  return { onlineUsers };
};
