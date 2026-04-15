'use client';

import { useGetProfile } from '@/hooks/useGetProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileHeader } from '@/components/dashboard/header/ProfileHeader';
import { UserPosts } from '@/components/dashboard/posts/UserPosts';
import Link from 'next/link';
import type { FC } from 'react';

export const Profile: FC = () => {
  const { data, isLoading } = useGetProfile();
  const user = data?.data;

  if (isLoading)
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="flex items-end gap-4 px-4 -mt-12">
          <Skeleton className="w-24 h-24 rounded-full" />
        </div>
        <div className="px-4 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );

  if (!user) return <div className="p-4 text-gray-500">User not found</div>;

  return (
    <div>
      <ProfileHeader
        user={user}
        actions={
          <Link href="/dashboard/settings">
            <button className="border border-border text-sm font-chirp-bold px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
              Edit profile
            </button>
          </Link>
        }
      />
      <UserPosts user={user} />
    </div>
  );
};
