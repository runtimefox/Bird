import { axiosClassicMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { resetToastMocks, toastError } from '../helpers/toast-mock';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithQuery } from '../helpers/query-wrapper';

const push = mock<(href: string) => void>(() => undefined);
mock.module('next/navigation', () => ({ useRouter: () => ({ push, refresh: () => {} }) }));

const { SignIn } = await import('@/components/SignIn');

const email = () => screen.getByPlaceholderText('john@example.com');
const password = () => screen.getByPlaceholderText('••••••••');
const submit = () => screen.getByRole('button');

describe('SignIn', () => {
  beforeEach(() => {
    resetAxiosMocks();
    resetToastMocks();
    push.mockClear();
  });

  it('refuses an empty form and says which fields are missing', async () => {
    renderWithQuery(<SignIn />);

    await userEvent.click(submit());

    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(axiosClassicMock.post).not.toHaveBeenCalled();
  });

  it('rejects a malformed email', async () => {
    renderWithQuery(<SignIn />);

    await userEvent.type(email(), 'not-an-email');
    await userEvent.type(password(), 'secret1');
    await userEvent.click(submit());

    await waitFor(() => expect(screen.getByText('Enter a valid email')).toBeInTheDocument());
    expect(axiosClassicMock.post).not.toHaveBeenCalled();
  });

  it('marks an invalid field for assistive tech', async () => {
    renderWithQuery(<SignIn />);

    await userEvent.click(submit());

    await waitFor(() => expect(email()).toHaveAttribute('aria-invalid', 'true'));
  });

  it('signs in with the entered credentials', async () => {
    axiosClassicMock.post.mockResolvedValue(axiosResponse({ access_token: 't', user: {} }));
    renderWithQuery(<SignIn />);

    await userEvent.type(email(), 'ivan@test.dev');
    await userEvent.type(password(), 'secret1');
    await userEvent.click(submit());

    await waitFor(() =>
      expect(axiosClassicMock.post).toHaveBeenCalledWith('/auth/sign-in', {
        email: 'ivan@test.dev',
        password: 'secret1',
      }),
    );
  });

  it('disables the button while the request is in flight', async () => {
    let release: (() => void) | undefined;
    axiosClassicMock.post.mockImplementationOnce(
      () =>
        new Promise((resolve) => (release = () => resolve(axiosResponse({ access_token: 't' })))),
    );
    renderWithQuery(<SignIn />);

    await userEvent.type(email(), 'ivan@test.dev');
    await userEvent.type(password(), 'secret1');
    await userEvent.click(submit());

    await waitFor(() => expect(submit()).toBeDisabled());
    expect(submit()).toHaveTextContent('Signing in...');

    await act(async () => {
      release?.();
      await Promise.resolve();
    });

    expect(submit()).not.toBeDisabled();
    expect(submit()).toHaveTextContent('Login');
  });

  it('surfaces the api message when the credentials are wrong', async () => {
    axiosClassicMock.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });
    renderWithQuery(<SignIn />);

    await userEvent.type(email(), 'ivan@test.dev');
    await userEvent.type(password(), 'wrong');
    await userEvent.click(submit());

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Invalid credentials'));
    expect(push).not.toHaveBeenCalled();
  });
});
