'use client';

import { useFollow } from '@/hooks/useFollow';
import { useGetProfile } from '@/hooks/useGetProfile';
import { userService } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { ProfileHeader } from '@/components/dashboard/header/ProfileHeader';
import { UserPosts } from '@/components/dashboard/posts/UserPosts';
import type { FC } from 'react';

interface IProfileUsersProps {
  id: string;
}

export const ProfileUsers: FC<IProfileUsersProps> = ({ id }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
  });
  const { data: me } = useGetProfile();
  const { isFollowing, toggleFollow, isPending } = useFollow(id);

  if (isLoading) return <div className="p-4 text-gray-500">Loading...</div>;

  const user = data?.data;
  if (!user) return <div className="p-4 text-gray-500">User not found</div>;

  return (
    <div>
      <ProfileHeader
        user={user}
        actions={
          me?.data.id !== id ? (
            <button
              onClick={toggleFollow}
              disabled={isPending}
              className={`border border-border text-sm font-chirp-bold px-4 py-2 rounded-full transition-colors ${
                isFollowing
                  ? 'bg-white text-black hover:bg-red-100 hover:text-red-500 hover:border-red-300'
                  : 'hover:bg-white/10'
              }`}
            >
              {isPending ? '...' : isFollowing ? 'Following' : 'Follow'}
            </button>
          ) : null
        }
      />
      <UserPosts user={user} />
    </div>
  );
};
