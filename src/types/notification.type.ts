type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW' | 'new_message';

export interface INotification {
  id: number;
  type: NotificationType;
  message: string;
  read: boolean;
  userId: string;
  fromId: string;
  postId?: string;
  createdAt: string;
  conversationId?: string;
  senderName?: string;
  content?: string;
  from: {
    username: string;
    avatar?: string;
  };
}
