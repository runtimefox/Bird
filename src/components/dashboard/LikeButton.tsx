'use client';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useLikes } from '@/hooks/useLikes';
import type { IPost } from '@/types/post.type';
import { useMemo, type FC } from 'react';
import { Button } from '../ui/button';
import { Heart } from 'lucide-react';

interface ILikeButtonProps {
  post: IPost;
}

export const LikeButton: FC<ILikeButtonProps> = ({ post }) => {
  const { data: user } = useGetProfile();
  const isLiked = useMemo(() => {
    return post.likes.some((l) => l.userId === user?.data?.id);
  }, [post, user]);
  const { mutate, isPending } = useLikes(post.id, isLiked);
  return (
    <Button
      variant="ghost"
      onClick={() => mutate()}
      disabled={isPending}
      className={`flex items-center gap-1 transition-colors hover: text-red-500`}
    >
      <Heart size={16} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
      {post._count.likes}
    </Button>
  );
};
