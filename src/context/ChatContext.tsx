'use client';
import { createContext, useContext, useState, type FC, type ReactNode } from 'react';

interface IChatContext {
  isOpenChat: boolean;
  selectedConversationId: string | null;
  openChat: (conversationId: string) => void;
  closeChat: () => void;
  setSelectedConversationId: (conversationId: string | null) => void;
}

const ChatContext = createContext<IChatContext | null>(null);

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const openChat = (conversationId: string) => {
    setIsOpenChat(true);
    setSelectedConversationId(conversationId);
  };

  const closeChat = () => {
    setIsOpenChat(false);
    setSelectedConversationId(null);
  };

  return (
    <ChatContext.Provider
      value={{
        isOpenChat,
        selectedConversationId,
        openChat,
        closeChat,
        setSelectedConversationId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
};
