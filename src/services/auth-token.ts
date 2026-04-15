import Cookies from 'js-cookie';

export enum ENUM_AUTH_TOKEN_TYPE {
  'ACCESS_TOKEN' = 'access_token',
  'REFRESH_TOKEN' = 'refresh_token',
}
class AuthToken {
  getAccessToken() {
    const access_token = Cookies.get(ENUM_AUTH_TOKEN_TYPE.ACCESS_TOKEN);
    return access_token;
  }
  saveAccessToken(access_token: string) {
    Cookies.set(ENUM_AUTH_TOKEN_TYPE.ACCESS_TOKEN, access_token, {
      sameSite: 'lax',
      expires: 1,
    });
  }
  removeAccessToken() {
    Cookies.remove(ENUM_AUTH_TOKEN_TYPE.ACCESS_TOKEN);
  }
}
export const authTokenService = new AuthToken();
