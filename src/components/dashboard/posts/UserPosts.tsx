'use client';
import { postService } from '@/services/post.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import type { TypeUserResponse } from '@/types/user.type';
import { type FC, useEffect, useRef } from 'react';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useDeletePost } from '@/hooks/useDeletePost';
import { PostCard } from './PostCard';
import { ErrorState } from '@/components/ErrorState';

interface IUserPostsProps {
  user: TypeUserResponse;
}

export const UserPosts: FC<IUserPostsProps> = ({ user }) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', 'user', user.id],
    queryFn: ({ pageParam = 1 }) => postService.getPostsByUserId(user.id!, { page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((count, page) => count + page.data.data.length, 0);
      return loaded < lastPage.data.total ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!user.id,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (triggerRef.current) observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { data: me } = useGetProfile();
  const { deletePost } = useDeletePost();

  const posts = data?.pages.flatMap((page) => page.data.data) ?? [];

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

  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div className="border-t border-border">
      {posts.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">No posts yet</div>
      )}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          showDelete={me?.data.id === user.id}
          onDelete={deletePost}
        />
      ))}
      <div ref={triggerRef} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <div className="border-b border-border p-4 flex gap-3 w-full">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
