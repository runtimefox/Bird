import { DASHBOARD } from '@/config/menu.config';
import { authService } from '@/services/auth.service';
import type { IAuthError, ISignUpForm } from '@/types/auth.type';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const useSignUp = () => {
  const { register, reset, handleSubmit } = useForm<ISignUpForm>();
  const { push } = useRouter();
  const { mutate } = useMutation({
    mutationKey: ['sign-up'],
    mutationFn: (data: ISignUpForm) => authService.signUp('sign-up', data),
    onSuccess: () => {
      reset();
      toast.success('You have successfully signed up!');
      push(DASHBOARD.HOME);
    },
    onError: (error: IAuthError) => {
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    },
  });
  const onSubmit = (data: ISignUpForm) => {
    mutate(data);
  };
  return {
    register,
    handleSubmit,
    onSubmit,
  };
};
