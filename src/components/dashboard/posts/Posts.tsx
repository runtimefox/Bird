'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { postService } from '@/services/post.service';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { type FC } from 'react';
import { LikeButton } from '../LikeButton';
import Link from 'next/link';
import { useCommentModal } from '@/context/CommentModalContext';

interface IPostsProps {
  activeTab: string;
}

export const Posts: FC<IPostsProps> = ({ activeTab }) => {
  const isFollowingTab = activeTab === 'Following';
  const { openCommentModal } = useCommentModal();
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', activeTab],
    queryFn: () => (isFollowingTab ? postService.getFollowingPosts() : postService.getPosts()),
  });

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
      {posts?.data.length === 0 && isFollowingTab ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <p className="text-xl font-chirp-bold">You aren't following anyone yet</p>
          <p className="text-gray-500 mt-2 text-sm">Follow people to see their posts here</p>
        </div>
      ) : (
        posts?.data.map((post) => (
          <div key={post.id} className="border-b border-border p-4 flex gap-3">
            <Link href={`/dashboard/profile/${post.authorId}`}>
              <Image
                src={post.author.avatar ?? '/profile.png'}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
                alt="avatar"
              />
            </Link>

            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <Link href={`/dashboard/profile/${post.authorId}`} className="hover:underline">
                  <span className="font-chirp-bold hover:underline">{post.author.name}</span>
                </Link>
                <span className="text-gray-500 text-sm">@{post.author.username}</span>
                <span className="text-gray-600 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Link href={`/posts/${post.id}`} className="block">
                <p className="mt-1">{post.content}</p>

                {post.image && (
                  <Image
                    src={post.image}
                    width={1200}
                    height={675}
                    className="mt-2 rounded-xl w-full object-contain max-h-80"
                    alt="post image"
                  />
                )}
              </Link>

              <div className="flex gap-4 mt-3 text-gray-500 text-sm">
                <LikeButton post={post} />
                <button
                  className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
                  onClick={() => openCommentModal(post)}
                >
                  <MessageCircle size={16} /> {post._count.comments}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
