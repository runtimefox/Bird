import { authTokenService } from '@/services/auth-token';
import axios, { type CreateAxiosDefaults } from 'axios';
import { errorCatch } from './error';
import { authService } from '@/services/auth.service';

const options: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const axiosClassic = axios.create(options);
const axiosAuth = axios.create(options);

axiosAuth.interceptors.request.use((config) => {
  const access_token = authTokenService.getAccessToken();
  if (config?.headers && access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});
axiosAuth.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error?.response?.status === 401 ||
        errorCatch(error) === 'jwt expired' ||
        errorCatch(error) === 'jwt must be provided') &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await authService.getNewTokens();
        return axiosAuth.request(originalRequest);
      } catch (error) {
        if (errorCatch(error) === 'jwt expired') authTokenService.removeAccessToken();
      }
    }
    throw error;
  },
);
export { axiosClassic, axiosAuth };
