import type { UseFormReset } from 'react-hook-form';
import { useGetProfile } from './useGetProfile';
import type { TypeUserForm } from '@/types/auth.type';
import { useEffect, useRef } from 'react';

export const useInitialData = (reset: UseFormReset<TypeUserForm>) => {
  const { data, isSuccess } = useGetProfile();
  const initialized = useRef(false);

  useEffect(() => {
    if (isSuccess && data && !initialized.current) {
      initialized.current = true;
      reset({
        email: data.data.email,
        name: data.data.name,
        username: data.data.username,
        bio: data.data.bio,
      });
    }
  }, [isSuccess]);

  return {};
};
