'use client';
import { useFollow } from '@/hooks/useFollow';
import { useGetProfile } from '@/hooks/useGetProfile';
import { userService } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { ProfileHeader } from '@/components/dashboard/header/ProfileHeader';
import { UserPosts } from '@/components/dashboard/posts/UserPosts';
import { useCreateConversations } from '@/hooks/useCreateConversations';
import type { FC } from 'react';
import { useChatStore } from '@/store/chat.store';

interface IProfileUsersProps {
  id: string;
}

export const ProfileUsers: FC<IProfileUsersProps> = ({ id }) => {
  const openChat = useChatStore((state) => state.openChat);
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
  });
  const { data: me } = useGetProfile();
  const { isFollowing, toggleFollow, isPending } = useFollow(id);
  const { createConversation } = useCreateConversations();

  if (isLoading) return <div className="p-4 text-gray-500">Loading...</div>;
  const user = data?.data;
  if (!user) return <div className="p-4 text-gray-500">User not found</div>;

  const handleMessage = async () => {
    const res = await createConversation(id);
    openChat(res.data.id);
  };

  return (
    <div>
      <ProfileHeader
        user={user}
        actions={
          me?.data.id !== id ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleMessage}
                className="border border-border text-sm font-chirp-bold px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                Message
              </button>
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
            </div>
          ) : null
        }
      />
      <UserPosts user={user} />
    </div>
  );
};
