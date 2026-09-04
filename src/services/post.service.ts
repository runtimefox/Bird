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
  async getPosts({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const response = await axiosAuth.get<{ data: IPost[]; total: number }>(`${this.URL}/all`, {
      params: {
        page,
        limit,
      },
    });
    return response;
  }
  async updatePost(postId: string, data: ICreatePost) {
    const response = await axiosAuth.patch<IPost>(`${this.URL}/update/${postId}`, data);
    return response;
  }
  async deletePost(postId: string) {
    const response = await axiosAuth.delete<boolean>(`${this.URL}/${postId}`);
    return response;
  }

  async likePost(postId: string) {
    const response = await axiosAuth.post(`${this.URL}/${postId}/like`);
    return response;
  }

  async unlikePost(postId: string) {
    const response = await axiosAuth.delete<boolean>(`${this.URL}/${postId}/unlike`);
    return response;
  }

  async getFollowingPosts({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const response = await axiosAuth.get<{ data: IPost[]; total: number }>(
      `${this.URL}/following`,
      {
        params: {
          page,
          limit,
        },
      },
    );
    return response;
  }

  async getPostById(postId: string) {
    const response = await axiosAuth.get<IPost>(`${this.URL}/${postId}`);
    return response;
  }
  async getPostsByUserId(
    userId: string,
    { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
  ) {
    const response = await axiosAuth.get<{ data: IPost[]; total: number }>(
      `${this.URL}/user/${userId}`,
      {
        params: {
          page,
          limit,
        },
      },
    );
    return response;
  }

  async getPopularHashtags() {
    const response = await axiosAuth.get<{ tag: string; count: number }[]>(
      `${this.URL}/hastags/popular`,
    );
    return response;
  }

  async searchByHastag(
    tag: string,
    { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
  ) {
    const response = await axiosAuth.get<{ data: IPost[]; total: number }>(
      `${this.URL}/search/hashtag`,
      {
        params: {
          tag,
          page,
          limit,
        },
      },
    );
    return response;
  }
}
export const postService = new Post();
