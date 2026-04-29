import Image from 'next/image';
import type { FC } from 'react';
import type { IMessage } from '@/types/chat.type';
import { formatTime } from '@/utils/chat.utils';

interface IChatMessageProps {
  message: IMessage;
  isMe: boolean;
}

export const ChatMessage: FC<IChatMessageProps> = ({ message, isMe }) => (
  <div className={`flex items-end gap-2 mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
    {!isMe && (
      <Image
        src={message.sender.avatar ?? '/profile.png'}
        width={28}
        height={28}
        className="rounded-full w-7 h-7 object-cover shrink-0"
        alt="avatar"
      />
    )}
    <div
      className={`px-3 py-2 rounded-2xl text-sm max-w-[70%] break-all ${isMe ? 'bg-white/20 text-white' : 'bg-white/10 text-white'}`}
    >
      {message.content}
      <p className="text-[10px] opacity-50 mt-1 text-right">{formatTime(message.createdAt)}</p>
    </div>
  </div>
);
