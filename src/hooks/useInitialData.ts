import type { UseFormReset } from 'react-hook-form';
import { useGetProfile } from './useGetProfile';
import type { TypeUserForm } from '@/types/auth.type';
import { useEffect } from 'react';

export const useInitialData = (reset: UseFormReset<TypeUserForm>) => {
  const { data, isSuccess } = useGetProfile();

  useEffect(() => {
    if (isSuccess && data) {
      reset({
        name: data.data.name,
        username: data.data.username,
        bio: data.data.bio,
      });
    }
    console.log('after reset');
  }, [isSuccess, data]);

  return {};
};
