import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

interface IPostAuthorProps {
  id: string;
  avatar: string | null | undefined;
  name: string | undefined;
  username: string;
}

export const PostAuthor: FC<IPostAuthorProps> = ({ id, avatar, name, username }) => (
  <Link
    href={`/dashboard/profile/${id}`}
    className="flex gap-3 items-center hover:opacity-80 transition-opacity"
  >
    <Image
      src={avatar ?? '/profile.png'}
      width={40}
      height={40}
      className="rounded-full w-10 h-10 object-cover shrink-0"
      alt="avatar"
    />
    <div>
      <span className="font-chirp-bold">{name}</span>
      <span className="text-gray-500 text-sm ml-2">@{username}</span>
    </div>
  </Link>
);
