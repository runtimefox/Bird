'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useComments } from '@/hooks/useComments';
import type { IPost } from '@/types/post.type';
import Image from 'next/image';

interface ICommentModalProps {
  post: IPost;
  open: boolean;
  onClose: () => void;
}

export const CommentModal = ({ post, open, onClose }: ICommentModalProps) => {
  const { content, setContent, mutate, isPending } = useComments(post.id, onClose);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reply</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 pb-4 border-b border-border">
          <Image
            src={post.author.avatar ?? '/profile.png'}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover shrink-0"
            alt="avatar"
          />
          <div>
            <div className="flex gap-2 items-center">
              <span className="font-chirp-bold">{post.author.name}</span>
              <span className="text-gray-500 text-sm">@{post.author.username}</span>
            </div>
            <p className="mt-1 text-sm">{post.content}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post your reply"
            className="flex-1 bg-transparent resize-none outline-none text-sm min-h-15"
          />
          <button
            onClick={() => mutate()}
            disabled={!content.trim() || isPending}
            className="self-end bg-white text-black text-sm font-chirp-bold px-4 py-2 rounded-full disabled:opacity-50"
          >
            Reply
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
