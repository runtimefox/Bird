import { create } from 'zustand';
interface IChatState {
  isOpenChat: boolean;
  selectedConversationId: string | null;
  openChat: (conversationId: string) => void;
  closeChat: () => void;
  setSelectedConversationId: (conversationId: string | null) => void;
}

export const useChatStore = create<IChatState>((set) => ({
  isOpenChat: false,
  selectedConversationId: null,

  openChat: (conversationId: string) =>
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
