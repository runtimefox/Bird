import { axiosAuth } from '@/api/interceptors';
import { type IFollow } from '@/types/follow.type';

export class Follows {
  private URL: string = '/follows';

  async followUser(userId: string) {
    const response = await axiosAuth.post<IFollow>(`${this.URL}/${userId}/follow`);
    return response;
  }
  async unfollowUser(userId: string) {
    const response = await axiosAuth.delete(`${this.URL}/${userId}`);
    return response;
  }
  async getFollowers(userId: string) {
    const response = await axiosAuth.get<IFollow[]>(`${this.URL}/${userId}/followers`);
    return response;
  }
  async getFollowing(userId: string) {
    const response = await axiosAuth.get<IFollow[]>(`${this.URL}/${userId}/following`);
    return response;
  }
}
export const followsService = new Follows();
