import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGetProfile } from './useGetProfile';
import { chatService } from '@/services/chat.service';

export const useCreateConversations = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetProfile();

  const { mutateAsync: createConversation } = useMutation({
    mutationFn: (userId2: string) => chatService.createConversation(user?.data.id ?? '', userId2),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
  return { createConversation };
};
