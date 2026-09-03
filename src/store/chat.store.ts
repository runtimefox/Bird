import { create } from 'zustand';
interface IChatState {
  isOpenChat: boolean;
  selectedConversationId: string | null;
  openChat: (conversationId: string | null) => void;
  closeChat: () => void;
  setSelectedConversationId: (conversationId: string | null) => void;
}

export const useChatStore = create<IChatState>((set) => ({
  isOpenChat: false,
  selectedConversationId: null,

  openChat: (conversationId: string | null) =>
    set({
      isOpenChat: true,
      selectedConversationId: conversationId,
    }),

  closeChat: () =>
    set({
      isOpenChat: false,
      selectedConversationId: null,
    }),

  setSelectedConversationId: (id: string | null) => set({ selectedConversationId: id }),
}));
