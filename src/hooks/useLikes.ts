'use client';
import { postService } from '@/services/post.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLikes = (postId: string, liked: boolean) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => (liked ? postService.unlikePost(postId) : postService.likePost(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  return { mutate, isPending };
};
