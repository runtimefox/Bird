import { describe, expect, it } from 'bun:test';
import { errorCatch } from '@/api/error';

describe('errorCatch', () => {
  it('returns the API message when it is a string', () => {
    const error = { response: { data: { message: 'Invalid credentials' } } };

    expect(errorCatch(error)).toBe('Invalid credentials');
  });

  it('returns the first entry when the API sends a validation array', () => {
    const error = {
      response: { data: { message: ['email must be an email', 'password is too short'] } },
    };

    expect(errorCatch(error)).toBe('email must be an email');
  });

  it('falls back to the axios message when there is no API response', () => {
    expect(errorCatch({ message: 'Network Error' })).toBe('Network Error');
  });

  it('falls back to the axios message when the response carries no message', () => {
    const error = { response: { data: {} }, message: 'Request failed with status code 500' };

    expect(errorCatch(error)).toBe('Request failed with status code 500');
  });

  it('recognises the refresh-token messages the interceptor branches on', () => {
    expect(errorCatch({ response: { data: { message: 'jwt expired' } } })).toBe('jwt expired');
    expect(errorCatch({ response: { data: { message: ['jwt must be provided'] } } })).toBe(
      'jwt must be provided',
    );
  });
});
