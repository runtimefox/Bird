import type { IUser } from './user.type';

export interface IMessage {
  id: string;
  content: string;
  createdAt: string;
  conversationId: string;
  senderId: string;
  sender: IUser;
}

export interface IConversation {
  id: string;
  createdAt: string;
  members: IConversationMember[];
  messages: IMessage[];
}

export interface IConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  user: IUser;
}
