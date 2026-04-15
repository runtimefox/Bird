import { axiosAuth } from '@/api/interceptors';
import type { IPost, ICreatePost } from '@/types/post.type';

class Post {
  private URL = '/posts';
  async createPost(data: FormData) {
    const response = await axiosAuth.post<IPost>(`${this.URL}/create-post`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  }
  async getPosts() {
    const response = await axiosAuth.get<IPost[]>(`${this.URL}/all`);
    return response;
  }
  async updatePost(postId: string, data: ICreatePost) {
    const response = await axiosAuth.put<IPost>(`${this.URL}/update-post/${postId}`, data);
    return response;
  }
  async deletePost(postId: string) {
    const response = await axiosAuth.delete<boolean>(`${this.URL}/${postId}`);
    return response;
  }

  async likePost(postId: string) {
    const response = await axiosAuth.post(`${this.URL}/${postId}`);
    return response;
  }

  async unlikePost(postId: string) {
    const response = await axiosAuth.delete<boolean>(`${this.URL}/${postId}`);
    return response;
  }

  async getFollowingPosts() {
    const response = await axiosAuth.get<IPost[]>(`${this.URL}/following`);
    return response;
  }

  async getPostById(postId: string) {
    const response = await axiosAuth.get<IPost>(`${this.URL}/${postId}`);
    return response;
  }
  async getPostsByUserId(userId: string) {
    const response = await axiosAuth.get<IPost[]>(`${this.URL}/user/${userId}`);
    return response;
  }
}
export const postService = new Post();
