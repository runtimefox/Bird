'use client';
import { userService } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';

export const useGetProfile = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
  });
  return { data, isLoading, isError };
};
