'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { postService } from '@/services/post.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import { type FC, useEffect, useRef } from 'react';
import { PostCard } from './PostCard';

interface IPostsProps {
  activeTab: string;
}

export const Posts: FC<IPostsProps> = ({ activeTab }) => {
  const isFollowingTab = activeTab === 'Following';
  const triggerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts', activeTab],
    queryFn: ({ pageParam = 1 }) =>
      isFollowingTab
        ? postService.getFollowingPosts({ page: pageParam })
        : postService.getPosts({ page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((count, page) => count + page.data.data.length, 0);
      return loaded < lastPage.data.total ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
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

  const posts = data?.pages.flatMap((page) => page.data.data) ?? [];

  if (isLoading)
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-border p-4 flex gap-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div>
      {posts.length === 0 && isFollowingTab ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <p className="text-xl font-chirp-bold">You aren&apos;t following anyone yet</p>
          <p className="text-gray-500 mt-2 text-sm">Follow people to see their posts here</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
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
