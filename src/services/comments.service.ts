import { axiosAuth } from '@/api/interceptors';
import { type IComment } from '@/types/comment.type';

export class CommentsService {
  private URL: string = '/comments';

  async createComment(postId: string, content: string) {
    const response = await axiosAuth.post<IComment>(`${this.URL}/posts/${postId}/comments`, {
      postId,
      content,
    });
    return response;
  }

  async getCommentsByPostId(postId: string) {
    const response = await axiosAuth.get<IComment[]>(`${this.URL}/post/${postId}`);
    return response;
  }

  async deleteComment(commentId: string) {
    const response = await axiosAuth.delete<boolean>(`${this.URL}/delete-comment/${commentId}`);
    return response;
  }
}
export const commentsService = new CommentsService();
