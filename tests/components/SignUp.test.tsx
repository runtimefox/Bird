import { axiosClassicMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { resetToastMocks, toastError } from '../helpers/toast-mock';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithQuery } from '../helpers/query-wrapper';

const push = mock<(href: string) => void>(() => undefined);
mock.module('next/navigation', () => ({ useRouter: () => ({ push, refresh: () => {} }) }));

const { SignUp } = await import('@/components/SignUp');

const username = () => screen.getByPlaceholderText('john_doe');
const email = () => screen.getByPlaceholderText('john@example.com');
const password = () => screen.getByPlaceholderText('••••••••');
const submit = () => screen.getByRole('button');

const fill = async (values: { username: string; email: string; password: string }) => {
  await userEvent.type(username(), values.username);
  await userEvent.type(email(), values.email);
  await userEvent.type(password(), values.password);
};

describe('SignUp', () => {
  beforeEach(() => {
    resetAxiosMocks();
    resetToastMocks();
    push.mockClear();
  });

  it('names every missing required field', async () => {
    renderWithQuery(<SignUp />);

    await userEvent.click(submit());

    await waitFor(() => expect(screen.getByText('Username is required')).toBeInTheDocument());
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(axiosClassicMock.post).not.toHaveBeenCalled();
  });

  it('rejects a too short username', async () => {
    renderWithQuery(<SignUp />);

    await fill({ username: 'ab', email: 'ivan@test.dev', password: 'secret1' });
    await userEvent.click(submit());

    await waitFor(() => expect(screen.getByText('At least 3 characters')).toBeInTheDocument());
    expect(axiosClassicMock.post).not.toHaveBeenCalled();
  });

  it('rejects a too short password', async () => {
    renderWithQuery(<SignUp />);

    await fill({ username: 'ivan', email: 'ivan@test.dev', password: 'abc' });
    await userEvent.click(submit());

    await waitFor(() => expect(screen.getByText('At least 6 characters')).toBeInTheDocument());
    expect(axiosClassicMock.post).not.toHaveBeenCalled();
  });

  it('leaves the optional name out of the way', async () => {
    axiosClassicMock.post.mockResolvedValue(axiosResponse({ access_token: 't' }));
    renderWithQuery(<SignUp />);

    await fill({ username: 'ivan', email: 'ivan@test.dev', password: 'secret1' });
    await userEvent.click(submit());

    await waitFor(() => expect(axiosClassicMock.post).toHaveBeenCalled());
    const body = axiosClassicMock.post.mock.calls[0][1] as Record<string, string>;
    expect(body.username).toBe('ivan');
    expect(body.name).toBe('');
  });

  it('surfaces the api message when the email is taken', async () => {
    axiosClassicMock.post.mockRejectedValue({
      response: { data: { message: 'Email already in use' } },
    });
    renderWithQuery(<SignUp />);

    await fill({ username: 'ivan', email: 'ivan@test.dev', password: 'secret1' });
    await userEvent.click(submit());

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Email already in use'));
    expect(push).not.toHaveBeenCalled();
  });
});
