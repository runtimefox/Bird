import { axiosAuth } from '@/api/interceptors';
import type { TypeUserResponse } from '@/types/user.type';

class UserService {
  private URL = '/users';
  async getProfile() {
    const response = await axiosAuth.get<TypeUserResponse>(`${this.URL}`);
    return response;
  }
  async getUserById(userId: string) {
    const response = await axiosAuth.get<TypeUserResponse>(`${this.URL}/${userId}`);
    return response;
  }
  async updateProfile(data: FormData) {
    const response = await axiosAuth.patch<TypeUserResponse>(`${this.URL}/update`, data);
    return response;
  }
  async searchUsers(query: string) {
    const response = await axiosAuth.get<TypeUserResponse[]>(`${this.URL}/search?q=${query}`);
    return response;
  }
}

export const userService = new UserService();
