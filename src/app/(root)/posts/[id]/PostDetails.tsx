'use client';

import { LikeButton } from '@/components/dashboard/LikeButton';
import { commentsService } from '@/services/comments.service';
import { postService } from '@/services/post.service';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { IComment } from '@/types/comment.type';
import { type FC } from 'react';
import { useCommentModal } from '@/context/CommentModalContext';

interface IPostDetailProps {
  id: string;
}

export const PostDetails: FC<IPostDetailProps> = ({ id }) => {
  const { openCommentModal } = useCommentModal();

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPostById(id),
    enabled: !!id,
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentsService.getCommentsByPostId(id),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="p-4 space-y-4">
        <div className="flex gap-3 items-center">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );

  if (!post?.data) return <div className="p-4 text-gray-500">Post not found</div>;

  const p = post.data;

  return (
    <div>
      <div className="border-b border-border p-4">
        <Link
          href={`/dashboard/profile/${p.author.id}`}
          className="flex gap-3 items-center hover:opacity-80 transition-opacity"
        >
          <Image
            src={p.author.avatar ?? '/profile.png'}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover shrink-0"
            alt="avatar"
          />
          <div>
            <span className="font-chirp-bold">{p.author.name}</span>
            <span className="text-gray-500 text-sm ml-2">@{p.author.username}</span>
          </div>
        </Link>
        <p className="mt-3 text-lg">{p.content}</p>
        {p.image && (
          <Image
            src={p.image}
            width={600}
            height={338}
            className="mt-3 rounded-xl w-full object-cover max-h-80"
            alt="post image"
          />
        )}
        <div className="flex gap-4 mt-4 text-gray-500 text-sm border-t border-border pt-4">
          <LikeButton post={p} />
          <button
            type="button"
            onClick={() => openCommentModal(post.data)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <MessageCircle size={16} />
            {p._count.comments}
          </button>
        </div>
      </div>

      <div>
        {comments?.data.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">No replies yet</div>
        )}
        {comments?.data.map((comment: IComment) => (
          <div key={comment.id} className="border-b border-border p-4 flex gap-3">
            <Link href={`/dashboard/profile/${comment.author.id}`}>
              <Image
                src={comment.author.avatar ?? '/profile.png'}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover shrink-0"
                alt="avatar"
              />
            </Link>
            <div>
              <div className="flex gap-2 items-center">
                <Link href={`/dashboard/profile/${comment.author.id}`} className="hover:underline">
                  <span className="font-chirp-bold">{comment.author.name}</span>
                </Link>
                <span className="text-gray-500 text-sm">@{comment.author.username}</span>
              </div>
              <p className="mt-1">{comment.content}</p>
              <span className="text-gray-500 text-xs mt-1 block">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
