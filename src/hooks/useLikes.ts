'use client';
import { postService } from '@/services/post.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { errorCatch } from '@/api/error';

export const useLikes = (postId: string, liked: boolean) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => (liked ? postService.unlikePost(postId) : postService.likePost(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (error) => toast.error(errorCatch(error)),
  });

  return { mutate, isPending };
};
