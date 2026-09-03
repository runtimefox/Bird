import { mock } from 'bun:test';
import type { AxiosResponse } from 'axios';

type Request = ReturnType<typeof mock<(...args: unknown[]) => Promise<AxiosResponse>>>;

const makeRequest = (): Request =>
  mock(async () => ({ data: undefined }) as unknown as AxiosResponse);

/**
 * Services are the only place allowed to touch axios, so every service, hook and
 * component test stubs the same seam: the two instances in `@/api/interceptors`.
 * Stubbing here instead of stubbing `@/services/*` keeps the real service code —
 * URLs, params, headers — under test.
 *
 * Import this helper first, then reach the module under test through
 * `await import(...)`. A static import of it would be linked before this file's
 * body runs, and would capture the real axios instance.
 */
export const axiosAuthMock = {
  get: makeRequest(),
  post: makeRequest(),
  put: makeRequest(),
  patch: makeRequest(),
  delete: makeRequest(),
};

export const axiosClassicMock = {
  get: makeRequest(),
  post: makeRequest(),
  put: makeRequest(),
  patch: makeRequest(),
  delete: makeRequest(),
};

mock.module('@/api/interceptors', () => ({
  axiosAuth: axiosAuthMock,
  axiosClassic: axiosClassicMock,
}));

/** Wraps a payload the way axios hands it back, so services return a realistic shape. */
export const axiosResponse = <T>(data: T) => ({ data }) as AxiosResponse<T>;

export const resetAxiosMocks = () => {
  for (const instance of [axiosAuthMock, axiosClassicMock]) {
    for (const request of Object.values(instance)) {
      request.mockReset();
      request.mockResolvedValue(axiosResponse(undefined));
    }
  }
};
