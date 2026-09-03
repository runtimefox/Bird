import { mock } from 'bun:test';
import type { AxiosResponse } from 'axios';

type Request = ReturnType<typeof mock<(...args: unknown[]) => Promise<AxiosResponse>>>;

const makeRequest = (): Request =>
  mock(async () => ({ data: undefined }) as unknown as AxiosResponse);

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

export const axiosResponse = <T>(data: T) => ({ data }) as AxiosResponse<T>;

export const resetAxiosMocks = () => {
  for (const instance of [axiosAuthMock, axiosClassicMock]) {
    for (const request of Object.values(instance)) {
      request.mockReset();
      request.mockResolvedValue(axiosResponse(undefined));
    }
  }
};
