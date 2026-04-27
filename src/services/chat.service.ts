import { axiosAuth } from '@/api/interceptors';
import type { IConversation, IMessage } from '@/types/chat.type';

class ChatService {
  private URL: string = '/chat';

  async getConversations(userId: string) {
    const response = await axiosAuth.get<IConversation[]>(`${this.URL}/conversations/${userId}`);
    return response;
  }

  async createConversation(userId1: string, userId2: string) {
    const response = await axiosAuth.post<IConversation>(`${this.URL}/conversations`, {
      userId1,
      userId2,
    });
    return response;
  }

  async getMessages(conversationId: string) {
    const response = await axiosAuth.get<IMessage[]>(`${this.URL}/messages/${conversationId}`);
    return response;
  }
}

export const chatService = new ChatService();
