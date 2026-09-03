'use client';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { errorCatch } from '@/api/error';

export const LogoutButton: FC = () => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.push('/auth');
      router.refresh();
    },
    onError: (error) => toast.error(errorCatch(error)),
  });
  return (
    <div className="absolute top-1 right-1">
      <Button
        className="opacity-20 hover:opacity-100 transition-opacity duration-300"
        onClick={() => mutate()}
      >
        <LogOut size={20} />
      </Button>
    </div>
  );
};
