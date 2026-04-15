type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW';

export interface INotification {
  id: number;
  type: NotificationType;
  message: string;
  read: boolean;
  userId: string;
  fromId: string;
  postId?: string;
  createdAt: string;
  from: {
    username: string;
    avatar?: string;
  };
}
