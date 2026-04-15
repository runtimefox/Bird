import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useGetProfile } from './useGetProfile';
import { followsService } from '@/services/follows.service';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
export const useFollow = (targetUserId: string) => {
  const queryClient = useQueryClient();

  const { data: me } = useGetProfile();

  const { data: following } = useQuery({
    queryKey: ['following', me?.data.id],
    queryFn: () => followsService.getFollowing(me!.data.id),
    enabled: !!me?.data.id,
  });
  console.log('following', following);
  const isFollowing = useMemo(
    () => following?.data?.some((f) => f.followingId === targetUserId) ?? false,
    [following, targetUserId],
  );

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      isFollowing
        ? followsService.unfollowUser(targetUserId)
        : followsService.followUser(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', me?.data.id] });
      queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['user', targetUserId] }); // ← добавь
      queryClient.invalidateQueries({ queryKey: ['profile'] }); // ← и свой профиль
      if (isFollowing) {
        toast.success('Unfollowed successfully!');
      } else {
        toast.success('Following!');
      }
    },
  });
  const toggleFollow = useCallback(() => {
    mutate();
  }, [mutate]);

  return { isFollowing, toggleFollow, isPending };
};
