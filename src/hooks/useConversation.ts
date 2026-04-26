import { chatService } from '@/services/chat.service';
import { useQuery } from '@tanstack/react-query';
import { useGetProfile } from './useGetProfile';

export const useConversations = () => {
  const { data: user } = useGetProfile();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.getConversations(user?.data.id ?? ''),
    enabled: !!user?.data.id,
  });

  return { conversations, isLoading };
};
