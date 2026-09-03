import { beforeEach, describe, expect, it, mock } from 'bun:test';

const get = mock<(name: string) => string | undefined>(() => undefined);
const set = mock<(name: string, value: string, options?: Record<string, unknown>) => void>(
  () => undefined,
);
const remove = mock<(name: string) => void>(() => undefined);

mock.module('js-cookie', () => ({ default: { get, set, remove } }));

const { authTokenService, ENUM_AUTH_TOKEN_TYPE } = await import('@/services/auth-token');

describe('authTokenService', () => {
  beforeEach(() => {
    get.mockClear();
    set.mockClear();
    remove.mockClear();
  });

  it('reads the access token from the access_token cookie', () => {
    get.mockReturnValueOnce('token-123');

    expect(authTokenService.getAccessToken()).toBe('token-123');
    expect(get).toHaveBeenCalledWith(ENUM_AUTH_TOKEN_TYPE.ACCESS_TOKEN);
  });

  it('returns undefined when the cookie is absent', () => {
    get.mockReturnValueOnce(undefined);

    expect(authTokenService.getAccessToken()).toBeUndefined();
  });

  it('writes the access token as a lax, 1-day cookie', () => {
    authTokenService.saveAccessToken('token-123');

    expect(set).toHaveBeenCalledWith(ENUM_AUTH_TOKEN_TYPE.ACCESS_TOKEN, 'token-123', {
      sameSite: 'lax',
      expires: 1,
    });
  });

  it('removes the access token cookie', () => {
    authTokenService.removeAccessToken();

    expect(remove).toHaveBeenCalledWith(ENUM_AUTH_TOKEN_TYPE.ACCESS_TOKEN);
  });

  it('never touches the refresh token, which the backend owns as httpOnly', () => {
    authTokenService.saveAccessToken('token-123');
    authTokenService.removeAccessToken();

    const touched = [...set.mock.calls, ...remove.mock.calls].map((call) => call[0]);
    expect(touched).not.toContain(ENUM_AUTH_TOKEN_TYPE.REFRESH_TOKEN);
  });
});
