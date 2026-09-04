'use client';
import { Button } from '@/components/ui/button';
import { useGetProfile } from '@/hooks/useGetProfile';
import { userService } from '@/services/user.service';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { errorCatch } from '@/api/error';

type TypeAccountForm = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

export const AccountSection: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
  } = useForm<TypeAccountForm>();
  const { data, isSuccess } = useGetProfile();
  const initialized = useRef(false);

  useEffect(() => {
    if (isSuccess && data && !initialized.current) {
      initialized.current = true;
      reset({
        email: data.data.email,
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [isSuccess]);

  const { mutate, isPending } = useMutation({
    mutationFn: (form: TypeAccountForm) =>
      userService.updatePassword(form.currentPassword, form.newPassword),
    onSuccess: () => {
      toast.success('Password updated');
      resetField('currentPassword');
      resetField('newPassword');
    },
    onError: (error) => toast.error(errorCatch(error)),
  });

  const onSubmit: SubmitHandler<TypeAccountForm> = (form) => mutate(form);

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-lg font-chirp-bold">Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="account-email" className="text-sm text-gray-400">
            Email
          </label>
          <input
            id="account-email"
            type="email"
            className="w-full mt-1 bg-transparent border border-border rounded-lg p-2"
            placeholder="email@example.com"
            {...register('email')}
          />
        </div>
        <div>
          <label htmlFor="account-current-password" className="text-sm text-gray-400">
            Current password
          </label>
          <input
            id="account-current-password"
            type="password"
            autoComplete="current-password"
            className="w-full mt-1 bg-transparent border border-border rounded-lg p-2"
            placeholder="••••••••"
            {...register('currentPassword', {
              required: 'Current password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="account-new-password" className="text-sm text-gray-400">
            New password
          </label>
          <input
            id="account-new-password"
            type="password"
            autoComplete="new-password"
            className="w-full mt-1 bg-transparent border border-border rounded-lg p-2"
            placeholder="••••••••"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-full px-6 py-2 bg-white text-black font-chirp-bold text-sm"
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </div>
  );
};
