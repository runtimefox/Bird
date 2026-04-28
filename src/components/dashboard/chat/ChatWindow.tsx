'use client';
import { useChat } from '@/hooks/useChat';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useEffect, useRef, useState, type FC } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import type { IConversation, IMessage } from '@/types/chat.type';

interface IChatWindowProps {
  conversationId: string;
  conversation: IConversation;
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-EN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateLabel = (date: string) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-EN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const groupMessagesByDate = (messages: IMessage[]) => {
  const groups: { label: string; messages: IMessage[] }[] = [];
  messages.forEach((message) => {
    const label = formatDateLabel(message.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.messages.push(message);
    } else {
      groups.push({ label, messages: [message] });
    }
  });
  return groups;
};

export const ChatWindow: FC<IChatWindowProps> = ({ conversationId, conversation }) => {
  const { data: user } = useGetProfile();
  const other = conversation.members.find((m) => m.userId !== user?.data.id);

  const { messages, sendMessage, sendTyping, isTyping, isOnline } = useChat(
    conversationId,
    other?.userId,
  );

  const [content, setContent] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    sendTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (!content.trim() || !user?.data.id) return;
    sendMessage(user.data.id, content);
    sendTyping(false);
    setContent('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
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
            {isTyping ? 'Typing...' : isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div ref={messagesRef} className="flex-1 overflow-y-auto py-2 min-h-0">
        {groupMessagesByDate(messages).map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-white/10" />
              <p className="text-xs text-gray-500 shrink-0">{group.label}</p>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            {group.messages.map((message) => {
              const isMe = message.senderId === user?.data.id;
              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
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
                    <p className="text-[10px] opacity-50 mt-1 text-right">
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 pt-2">
        <input
          value={content}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Write a message..."
          className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button onClick={handleSend} className="p-2 hover:opacity-80 transition-opacity">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
