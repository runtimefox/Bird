import { axiosClassic } from '@/api/interceptors';
import type { ISignInForm, ISignUpForm, IAuthResponse } from '@/types/auth.type';
import { authTokenService } from './auth-token';

class Auth {
  private URL = '/auth';
  async signIn(type: 'sign-in', data: ISignInForm) {
    const response = await axiosClassic.post<IAuthResponse>(`${this.URL}/${type}`, data);
    if (response.data.access_token) {
      authTokenService.saveAccessToken(response.data.access_token);
    }
    return response;
  }
  async signUp(type: 'sign-up', data: ISignUpForm) {
    const response = await axiosClassic.post<IAuthResponse>(`${this.URL}/${type}`, data);
    if (response.data.access_token) {
      authTokenService.saveAccessToken(response.data.access_token);
    }
    return response;
  }
  async logout() {
    const response = await axiosClassic.post<boolean>(`${this.URL}/sign-out`);
    authTokenService.removeAccessToken();
    return response;
  }
  async getNewTokens() {
    const response = await axiosClassic.post<IAuthResponse>(`${this.URL}/login/access-token`);
    if (response.data.access_token) {
      authTokenService.saveAccessToken(response.data.access_token);
    }
    return response;
  }
}
export const authService = new Auth();
