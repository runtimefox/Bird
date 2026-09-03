import { mock } from 'bun:test';

export const toastSuccess = mock<(message: string) => void>(() => undefined);
export const toastError = mock<(message: string) => void>(() => undefined);

const toast = Object.assign(
  mock<(message: string) => void>(() => undefined),
  {
    success: toastSuccess,
    error: toastError,
  },
);

mock.module('react-hot-toast', () => ({ default: toast, toast }));

export const resetToastMocks = () => {
  toastSuccess.mockClear();
  toastError.mockClear();
};
