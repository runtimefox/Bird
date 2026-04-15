import { DASHBOARD } from '@/config/menu.config';
import { authService } from '@/services/auth.service';
import type { IAuthError, ISignInForm } from '@/types/auth.type';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const useSignIn = () => {
  const { register, handleSubmit, reset } = useForm<ISignInForm>();
  const { push } = useRouter();
  const { mutate } = useMutation({
    mutationKey: ['sign-in'],
    mutationFn: (data: ISignInForm) => authService.signIn('sign-in', data),
    onSuccess: () => {
      toast.success('You have successfully signed in!');
      reset();
      push(DASHBOARD.HOME);
    },
    onError: (error: IAuthError) => {
      const errorMessage =
        error?.response?.data?.message || 'Authentication failed. Please try again.';
      toast.error(errorMessage);
    },
  });
  const onSubmit = (data: ISignInForm) => {
    mutate(data);
  };
  return {
    register,
    handleSubmit,
    onSubmit,
  };
};
