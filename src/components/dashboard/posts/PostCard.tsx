// components/dashboard/posts/PostCard.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { LikeButton } from '../LikeButton';
import { useCommentModalStore } from '@/store/commentModal.store';
import type { IPost } from '@/types/post.type';
import type { FC } from 'react';

interface IPostCardProps {
  post: IPost;
}

export const PostCard: FC<IPostCardProps> = ({ post }) => {
  const { openCommentModal } = useCommentModalStore();

  return (
    <div className="border-b border-border p-4 flex gap-3">
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
        <Link href={`/posts/${post.id}`} className="block">
          <p className="mt-1">{post.content}</p>
          {post.image && (
            <div className="mt-3 rounded-2xl w-full overflow-hidden bg-gray-900 border border-gray-700 aspect-video relative">
              <Image
                fill
                src={post.image}
                className="object-cover blur-xl scale-110 opacity-50"
                alt=""
                aria-hidden
              />
              <Image
                fill
                src={post.image}
                className="object-contain"
                alt="post image"
                sizes="(max-width: 600px) 100vw, 600px"
              />
            </div>
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
  );
};
