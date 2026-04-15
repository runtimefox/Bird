'use client';
import { CommentModal } from '@/components/dashboard/comments/CommentModal';
import { type IPost } from '@/types/post.type';
import { createContext, useContext, useState, type FC, type ReactNode } from 'react';

interface ICommentModalContext {
  openCommentModal: (post: IPost) => void;
}

const CommentModalContext = createContext<ICommentModalContext | null>(null);

export const CommentModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [commentPost, setCommentPost] = useState<IPost | null>(null);

  return (
    <CommentModalContext.Provider value={{ openCommentModal: setCommentPost }}>
      {children}
      {commentPost && (
        <CommentModal
          post={commentPost}
          open={!!commentPost}
          onClose={() => setCommentPost(null)}
        />
      )}
    </CommentModalContext.Provider>
  );
};

export const useCommentModal = () => {
  const ctx = useContext(CommentModalContext);
  if (!ctx) throw new Error('useCommentModal must be used within CommentModalProvider');
  return ctx;
};
