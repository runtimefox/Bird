'use client';
import { MessageSquareMoreIcon, Minus, ArrowLeft, Plus } from 'lucide-react';
import { useState, type FC } from 'react';
import { useGetProfile } from '@/hooks/useGetProfile';
import { ChatWindow } from './ChatWindow';
import { ConversationItem } from './ConversationItem';
import { useConversations } from '@/hooks/useConversation';
import { useCreateConversations } from '@/hooks/useCreateConversations';
import { NewChat } from './NewChat';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { useChatStore } from '@/store/chat.store';
import { useUnread } from '@/hooks/useUnRead';
import { useMarkAsRead } from '@/hooks/useMarkAsRead';

interface IConversationListProps {
  toggleChat: () => void;
}

export const ConversationList: FC<IConversationListProps> = ({ toggleChat }) => {
  const isOpenChat = useChatStore((state) => state.isOpenChat);
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const setSelectedConversationId = useChatStore((state) => state.setSelectedConversationId);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations } = useConversations();
  const { data: user } = useGetProfile();
  const { createConversation } = useCreateConversations();
  const { onlineUsers } = useOnlineUsers();
  const { unread } = useUnread();
  const { markAsRead } = useMarkAsRead();

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId);
    await markAsRead(conversationId);
  };

  const unreadCount = unread?.data ?? 0;

  const handleCreateConversation = async (userId2: string) => {
    const res = await createConversation(userId2);
    setIsCreating(false);
    setSearchQuery('');
    setSelectedConversationId(res.data.id);
  };

  const handleBack = () => {
    if (isCreating) {
      setIsCreating(false);
      setSearchQuery('');
    } else {
      setSelectedConversationId(null);
    }
  };

  return (
    <div className="relative flex justify-end items-end flex-1">
      <button onClick={toggleChat} className="hover:opacity-80 transition-opacity">
        <MessageSquareMoreIcon width={'35px'} height={'35px'} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <div
        className={`absolute bottom-0 right-0 w-96 h-113 bg-[#1a1a1a] border border-white/10 rounded-lg p-4
          transition-all duration-300 origin-bottom-right z-50 shadow-2xl flex flex-col
          ${isOpenChat ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {(selectedConversationId || isCreating) && (
              <button
                onClick={handleBack}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft width={'20px'} height={'20px'} className="text-gray-500" />
              </button>
            )}
            <h2 className="text-lg font-chirp-bold text-white">
              {isCreating ? 'New Chat' : 'Chat'}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {!selectedConversationId && !isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <Plus width={'20px'} height={'20px'} className="text-gray-500" />
              </button>
            )}
            <button
              onClick={toggleChat}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <Minus width={'20px'} height={'20px'} className="text-gray-500" />
            </button>
          </div>
        </div>
        {isCreating && (
          <NewChat
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelect={handleCreateConversation}
          />
        )}
        {!selectedConversationId && !isCreating && (
          <div className="flex-1 overflow-y-auto space-y-1">
            {!conversations?.data?.length && (
              <p className="text-gray-500 text-sm text-center">No conversations yet</p>
            )}
            {conversations?.data?.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                currentUserId={user?.data.id ?? ''}
                onlineUsers={onlineUsers}
                onClick={() => handleSelectConversation(conversation.id)}
              />
            ))}
          </div>
        )}
        {selectedConversationId &&
          (() => {
            const conversation = conversations?.data?.find((c) => c.id === selectedConversationId);
            if (!conversation) return null;
            return (
              <ChatWindow conversationId={selectedConversationId} conversation={conversation} />
            );
          })()}
      </div>
    </div>
  );
};
