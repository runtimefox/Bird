'use client';
import Image from 'next/image';
import { useMemo, type FC } from 'react';
import type { IConversation } from '@/types/chat.type';

interface IConversationItemProps {
  conversation: IConversation;
  currentUserId: string;
  onlineUsers: string[];
  onClick: () => void;
}

export const ConversationItem: FC<IConversationItemProps> = ({
  conversation,
  currentUserId,
  onlineUsers,
  onClick,
}) => {
  const other = useMemo(
    () => conversation.members.find((m) => m.userId !== currentUserId),
    [conversation, currentUserId],
  );
  const lastMessage = conversation.messages[0];
  const isOnline = onlineUsers.includes(other?.userId ?? '');

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
    >
      <div className="relative shrink-0">
        <Image
          src={other?.user.avatar ?? '/profile.png'}
          width={40}
          height={40}
          className="rounded-full w-10 h-10 object-cover"
          alt="avatar"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-chirp-bold truncate">
          {other?.user.name ?? other?.user.username}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {lastMessage?.content?.split(' ').slice(0, 10).join(' ') ?? 'No messages yet'}
        </p>
      </div>
    </div>
  );
};
