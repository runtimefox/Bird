import type { IPost } from '@/types/post.type';
import { create } from 'zustand';

interface ICommentModalState {
  post: IPost | null;
  open: (post: IPost) => void;
  close: () => void;
  openCommentModal: (post: IPost) => void;
}

export const useCommentModalStore = create<ICommentModalState>((set) => ({
  post: null,
  open: (post: IPost) => set({ post }),
  close: () => set({ post: null }),
  openCommentModal: (post: IPost) => set({ post }),
}));
