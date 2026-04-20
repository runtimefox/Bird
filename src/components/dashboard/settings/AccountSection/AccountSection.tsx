'use client';
import { Button } from '@/components/ui/button';
import { useGetProfile } from '@/hooks/useGetProfile';
import { userService } from '@/services/user.service';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

type TypeAccountForm = {
  email: string;
  newPassword: string;
};

export const AccountSection: FC = () => {
  const { register, handleSubmit, reset } = useForm<TypeAccountForm>();
  const { data, isSuccess } = useGetProfile();
  const initialized = useRef(false);
  const { push } = useRouter();

  useEffect(() => {
    if (isSuccess && data && !initialized.current) {
      initialized.current = true;
      reset({
        email: data.data.email,
        newPassword: '',
      });
    }
  }, [isSuccess]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: string) => userService.updatePasssword(data),
    onSuccess: () => toast.success('Password updated'),
    onError: () => toast.error('Something went wrong'),
  });

  const onSubmit: SubmitHandler<TypeAccountForm> = (data) => {
    mutate(data.newPassword);
  };

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-lg font-bold">Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <input
            type="email"
            className="w-full mt-1 bg-transparent border border-border rounded-lg p-2"
            placeholder="email@example.com"
            {...register('email')}
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">New password</label>
          <input
            type="password"
            className="w-full mt-1 bg-transparent border border-border rounded-lg p-2"
            placeholder="••••••••"
            {...register('newPassword')}
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-full px-6 py-2 bg-white text-black font-bold text-sm"
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </div>
  );
};
