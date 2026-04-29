'use client';
import { useChat } from '@/hooks/useChat';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useEffect, useRef, useState, type FC } from 'react';
import { Send } from 'lucide-react';
import type { IConversation } from '@/types/chat.type';
import { groupMessagesByDate } from '@/utils/chat.utils';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';

interface IChatWindowProps {
  conversationId: string;
  conversation: IConversation;
}

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
      <ChatHeader other={other} isOnline={isOnline} isTyping={isTyping} />
      <div ref={messagesRef} className="flex-1 overflow-y-auto py-2 min-h-0">
        {groupMessagesByDate(messages).map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-white/10" />
              <p className="text-xs text-gray-500 shrink-0">{group.label}</p>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            {group.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isMe={message.senderId === user?.data.id}
              />
            ))}
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
