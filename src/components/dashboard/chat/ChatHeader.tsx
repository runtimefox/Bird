import Image from 'next/image';
import type { FC } from 'react';
import type { IConversationMember } from '@/types/chat.type';
import { formatLastSeen } from '@/utils/chat.utils';

interface IChatHeaderProps {
  other?: IConversationMember;
  isOnline: boolean;
  isTyping: boolean;
}

export const ChatHeader: FC<IChatHeaderProps> = ({ other, isOnline, isTyping }) => (
  <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-2">
    <div className="relative">
      <Image
        src={other?.user.avatar ?? '/profile.png'}
        width={36}
        height={36}
        className="rounded-full w-9 h-9 object-cover"
        alt="avatar"
      />
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
      )}
    </div>
    <div>
      <p className="text-sm font-chirp-bold">{other?.user.name ?? other?.user.username}</p>
      <p className="text-xs text-gray-500">
        {isTyping
          ? 'Typing...'
          : isOnline
            ? 'Online'
            : other?.user.lastSeen
              ? `Last seen ${formatLastSeen(other.user.lastSeen)}`
              : 'Offline'}
      </p>
    </div>
  </div>
);
