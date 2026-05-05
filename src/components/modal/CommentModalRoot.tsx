'use client';
import { CommentModal } from '@/components/dashboard/comments/CommentModal';
import { useCommentModalStore } from '@/store/commentModal.store';
import { type FC } from 'react';

export const CommentModalRoot: FC = () => {
  const commentPost = useCommentModalStore((state) => state.post);
  const close = useCommentModalStore((state) => state.close);

  return <>{commentPost && <CommentModal post={commentPost} open={true} onClose={close} />}</>;
};
