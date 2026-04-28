import { chatService } from '@/services/chat.service';
import { useQuery } from '@tanstack/react-query';
import { useGetProfile } from './useGetProfile';

export const useUnread = () => {
  const { data: user } = useGetProfile();

  const { data: unread } = useQuery({
    queryKey: ['unread'],
    queryFn: () => chatService.getUnreadCount(),
    enabled: !!user?.data.id,
    refetchInterval: 5000,
  });

  return { unread };
};
