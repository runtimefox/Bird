'use client';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import toast from 'react-hot-toast';

export const SecuritySection: FC = () => {
  const { push } = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => userService.deleteUser(),
    onSuccess: () => {
      authService.logout();
      toast.success('User successfully deleted');
      push('/auth');
    },
  });

  const onSubmit = () => {
    if (!confirm('Are you sure you want to delete your account?')) return;
    mutate();
  };

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-lg font-bold">Security</h2>
      <p className="text-sm text-gray-400">Manage your account security.</p>
      <button
        onClick={onSubmit}
        className="rounded-full px-6 py-2 border border-red-500 text-red-500 text-sm"
      >
        Delete account
      </button>
    </div>
  );
};
