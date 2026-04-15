import type { TypeUserResponse } from '@/types/user.type';
import type { FC, ReactNode } from 'react';
import Image from 'next/image';
interface IProfileHeaderProps {
  user: TypeUserResponse;
  actions?: ReactNode;
}

export const ProfileHeader: FC<IProfileHeaderProps> = ({ user, actions }) => {
  return (
    <>
      <div className="h-32 bg-gray-800 w-full" />
      <div className="flex items-end justify-between px-4 -mt-12 mb-4">
        <Image
          src={user.avatar ?? '/profile.png'}
          width={96}
          height={96}
          className="rounded-full w-24 h-24 object-cover border-4 border-black"
          alt="avatar"
        />
        {actions}
      </div>
      <div className="px-4 space-y-1 mb-4">
        <p className="font-chirp-bold text-lg">{user.name ?? user.username}</p>
        <p className="text-gray-500 text-sm">@{user.username}</p>
        {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
        <div className="flex gap-4 mt-2 text-sm">
          <span>
            <span className="font-chirp-bold">{user.following?.length ?? 0}</span>
            <span className="text-gray-500 ml-1">Following</span>
          </span>
          <span>
            <span className="font-chirp-bold">{user.followers?.length ?? 0}</span>
            <span className="text-gray-500 ml-1">Followers</span>
          </span>
        </div>
      </div>
    </>
  );
};
