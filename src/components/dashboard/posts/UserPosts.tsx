'use client';
import { postService } from '@/services/post.service';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import type { TypeUserResponse } from '@/types/user.type';
import type { FC } from 'react';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useDeletePost } from '@/hooks/useDeletePost';
import { PostCard } from './PostCard';

interface IUserPostsProps {
  user: TypeUserResponse;
}

export const UserPosts: FC<IUserPostsProps> = ({ user }) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', 'user', user.id],
    queryFn: () => postService.getPostsByUserId(user.id!),
    enabled: !!user.id,
  });
  const { data: me } = useGetProfile();
  const { deletePost } = useDeletePost();

  if (isLoading)
    return (
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
    );

  return (
    <div className="border-t border-border">
      {posts?.data.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">No posts yet</div>
      )}
      {posts?.data.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          showDelete={me?.data.id === user.id}
          onDelete={deletePost}
        />
      ))}
    </div>
  );
};
