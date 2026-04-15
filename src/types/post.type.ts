import type { IUser } from './user.type';

export interface ICreatePost {
  content: string;
  image?: string;
}
export interface IPost {
  id: string;
  content: string;
  image?: string;
  authorId: string;
  likes: { userId: string; id: string }[];
  author: IUser;
  _count: {
    likes: number;
    comments: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
