'use client';
import { LikeButton } from '@/components/dashboard/LikeButton';
import { commentsService } from '@/services/comments.service';
import { postService } from '@/services/post.service';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { IComment } from '@/types/comment.type';
import { type FC } from 'react';
import { useCommentModalStore } from '@/store/commentModal.store';
import { CommentItem } from '@/components/dashboard/comments/CommentItem';
import { PostAuthor } from '@/components/dashboard/posts/PostAuthor';
import { PostImage } from '@/components/dashboard/posts/PostImage';
import { ErrorState } from '@/components/ErrorState';

interface IPostDetailProps {
  id: string;
}

export const PostDetails: FC<IPostDetailProps> = ({ id }) => {
  const { openCommentModal } = useCommentModalStore();

  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
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

  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

  if (!post?.data) return <div className="p-4 text-gray-500">Post not found</div>;

  const p = post.data;

  return (
    <div>
      <div className="border-b border-border p-4">
        <PostAuthor
          id={p.author.id}
          avatar={p.author.avatar}
          name={p.author.name}
          username={p.author.username}
        />
        <p className="mt-3 text-lg">{p.content}</p>
        {p.image && <PostImage src={p.image} />}
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
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
