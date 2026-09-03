'use client';
import { errorCatch } from '@/api/error';
import { postService } from '@/services/post.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: (_, postId) => {
      toast.success('Post deleted!');
      queryClient.removeQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => toast.error(errorCatch(error)),
  });

  return { deletePost, isPending };
};
