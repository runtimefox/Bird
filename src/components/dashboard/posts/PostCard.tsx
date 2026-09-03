import { useCommentModalStore } from '@/store/commentModal.store';
import type { IPost } from '@/types/post.type';
import Image from 'next/image';
import Link from 'next/link';
import { PostImage } from './PostImage';
import { LikeButton } from '../LikeButton';
import { MessageCircle, Trash2 } from 'lucide-react';
import type { FC } from 'react';

interface IPostCardProps {
  post: IPost;
  onDelete?: (postId: string) => void;
  showDelete?: boolean;
}

export const PostCard: FC<IPostCardProps> = ({ post, onDelete, showDelete }) => {
  const { openCommentModal } = useCommentModalStore();
  const profileHref = `/dashboard/profile/${post.authorId}`;

  return (
    <article className="relative border-b border-border p-4 flex gap-3 hover:bg-white/5 transition-colors">
      <Link
        href={`/posts/${post.id}`}
        aria-label={`Post by @${post.author.username}`}
        className="absolute inset-0"
      />
      <Link href={profileHref} className="relative">
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
          <Link href={profileHref} className="relative hover:underline">
            <span className="font-chirp-bold">{post.author.name}</span>
          </Link>
          <span className="text-gray-500 text-sm">@{post.author.username}</span>
          <span className="text-gray-600 text-sm">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <p className="mt-1">{post.content}</p>
        {post.image && <PostImage src={post.image} />}
        <div className="relative flex gap-4 mt-3 text-gray-500 text-sm">
          <LikeButton post={post} />
          <button
            className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
            onClick={() => openCommentModal(post)}
          >
            <MessageCircle size={16} /> {post._count.comments}
          </button>
          {showDelete && onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="flex items-center gap-1 hover:text-red-500 transition-colors ml-auto"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
