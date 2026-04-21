'use client';
import { LikeButton } from '@/components/dashboard/LikeButton';
import { postService } from '@/services/post.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { TypeUserResponse } from '@/types/user.type';
import type { FC } from 'react';
import { useGetProfile } from '@/hooks/useGetProfile';
import toast from 'react-hot-toast';

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
  const queryClient = useQueryClient();

  const { mutate: deletePost } = useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: () => {
      toast.success('Post deleted!');
      queryClient.invalidateQueries({ queryKey: ['posts', 'user', user.id] });
    },
  });

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
        <Link href={`/posts/${post.id}`} key={post.id}>
          <div className="border-b border-border p-4 flex gap-3 hover:bg-white/5 transition-colors cursor-pointer">
            <Image
              src={user.avatar ?? '/profile.png'}
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover shrink-0"
              alt="avatar"
            />
            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <span className="font-chirp-bold">{user.name ?? user.username}</span>
                <span className="text-gray-500 text-sm">@{user.username}</span>
                <span className="text-gray-600 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
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
              <div
                className="flex gap-4 mt-3 text-gray-500 text-sm"
                onClick={(e) => e.preventDefault()}
              >
                <LikeButton post={post} />
                <span className="flex items-center gap-1">
                  <MessageCircle size={16} /> {post._count.comments}
                </span>
              </div>
              {me?.data.id === user.id && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deletePost(post.id);
                  }}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors ml-auto"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
