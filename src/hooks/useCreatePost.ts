import { postService } from '@/services/post.service';
import type { ICreatePost } from '@/types/post.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useGetProfile } from './useGetProfile';

export const useCreatePost = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, control } = useForm<ICreatePost>();
  const text = useWatch({ control, name: 'content' }) as string;

  const { data: user } = useGetProfile();

  const { mutate, isPending } = useMutation({
    mutationKey: ['create-post'],
    mutationFn: (data: FormData) => postService.createPost(data),
    onSuccess: () => {
      toast.success('Post created successfully!');
      reset();
      setPreview(null);
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onSuccess?.();
    },
    onError: () => toast.error('Failed to create post. Please try again.'),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: ICreatePost) => {
    const formData = new FormData();
    formData.append('content', data.content);
    if (file) formData.append('image', file);
    mutate(formData);
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    text,
    isPending,
    preview,
    setPreview,
    setFile,
    handleFile,
    user,
  };
};
