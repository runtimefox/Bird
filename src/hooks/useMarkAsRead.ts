import { chatService } from '@/services/chat.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { mutate: markAsRead } = useMutation({
    mutationFn: (conversationId: string) => chatService.markAsRead(conversationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['unread'] }),
  });

  return { markAsRead };
};
