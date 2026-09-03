import Image from 'next/image';
import Link from 'next/link';
import type { IComment } from '@/types/comment.type';
import type { FC } from 'react';
import { DASHBOARD } from '@/config/menu.config';

interface ICommentItemProps {
  comment: IComment;
}

export const CommentItem: FC<ICommentItemProps> = ({ comment }: { comment: IComment }) => (
  <div className="border-b border-border p-4 flex gap-3">
    <Link href={`${DASHBOARD.PROFILE}/${comment.author.id}`}>
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
        <Link href={`${DASHBOARD.PROFILE}/${comment.author.id}`} className="hover:underline">
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
);
