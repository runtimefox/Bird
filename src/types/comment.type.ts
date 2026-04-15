export interface IComment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}
