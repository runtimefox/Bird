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
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ErrorState';

interface IProfileUsersProps {
  id: string;
}

export const ProfileUsers: FC<IProfileUsersProps> = ({ id }) => {
  const openChat = useChatStore((state) => state.openChat);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
  });
  const { data: me } = useGetProfile();
  const { isFollowing, toggleFollow, isPending } = useFollow(id);
  const { createConversation } = useCreateConversations();

  if (isLoading) {
    return (
      <div>
        <div className="p-4 flex flex-col gap-4">
          <Skeleton className="w-full h-32 rounded-xl" />
          <div className="flex justify-between items-end">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="w-24 h-9 rounded-full" />
              <Skeleton className="w-24 h-9 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="w-32 h-5" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-48 h-4" />
          </div>
        </div>

        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-border p-4 flex gap-3">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

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
