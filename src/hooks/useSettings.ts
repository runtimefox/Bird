'use client';

import { userService } from '@/services/user.service';
import type { TypeUserForm } from '@/types/auth.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useGetProfile } from './useGetProfile';

export const useSettings = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetProfile();
  const { register, handleSubmit, reset } = useForm<TypeUserForm>();
  useEffect(() => {
    if (user?.data) {
      reset({
        name: user.data.name ?? '',
        username: user.data.username ?? '',
        bio: user.data.bio ?? '',
      });
    }
  }, [user?.data, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => userService.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.refetchQueries({ queryKey: ['profile'] });
    },
    onError: () => toast.error(`Failed to update profile`),
  });

  const onSubmit = (data: TypeUserForm, avatarFile?: File | null) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.username) formData.append('username', data.username);
    if (data.bio !== undefined) formData.append('bio', data.bio);
    if (avatarFile) formData.append('avatar', avatarFile);
    mutate(formData);
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    isPending,
    user,
  };
};
