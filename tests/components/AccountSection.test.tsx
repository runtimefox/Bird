import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { resetToastMocks, toastError, toastSuccess } from '../helpers/toast-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeUser } from '../helpers/fixtures';
import { renderWithQuery } from '../helpers/query-wrapper';

const { AccountSection } = await import(
  '@/components/dashboard/settings/AccountSection/AccountSection'
);

const currentPassword = () => screen.getByLabelText('Current password');
const newPassword = () => screen.getByLabelText('New password');
const submit = () => screen.getByRole('button', { name: /Save/ });

const serveProfile = () =>
  axiosAuthMock.get.mockResolvedValue(axiosResponse(makeUser({ email: 'ivan@test.dev' })));

describe('AccountSection', () => {
  beforeEach(() => {
    resetAxiosMocks();
    resetToastMocks();
    serveProfile();
  });

  it('sends both the current and the new password', async () => {
    axiosAuthMock.patch.mockResolvedValue(axiosResponse({ message: 'ok' }));
    renderWithQuery(<AccountSection />);

    await userEvent.type(currentPassword(), 'oldsecret');
    await userEvent.type(newPassword(), 'newsecret');
    await userEvent.click(submit());

    await waitFor(() =>
      expect(axiosAuthMock.patch).toHaveBeenCalledWith('/users/password', {
        currentPassword: 'oldsecret',
        newPassword: 'newsecret',
      }),
    );
  });

  it('refuses to submit without the current password', async () => {
    renderWithQuery(<AccountSection />);

    await userEvent.type(newPassword(), 'newsecret');
    await userEvent.click(submit());

    await waitFor(() =>
      expect(screen.getByText('Current password is required')).toBeInTheDocument(),
    );
    expect(axiosAuthMock.patch).not.toHaveBeenCalled();
  });

  it('refuses a password shorter than the api allows', async () => {
    renderWithQuery(<AccountSection />);

    await userEvent.type(currentPassword(), 'oldsecret');
    await userEvent.type(newPassword(), 'short');
    await userEvent.click(submit());

    await waitFor(() =>
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument(),
    );
    expect(axiosAuthMock.patch).not.toHaveBeenCalled();
  });

  it('shows the api message when the current password is wrong', async () => {
    axiosAuthMock.patch.mockRejectedValue({
      response: { data: { message: 'Current password is incorrect' } },
    });
    renderWithQuery(<AccountSection />);

    await userEvent.type(currentPassword(), 'wrongone');
    await userEvent.type(newPassword(), 'newsecret');
    await userEvent.click(submit());

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Current password is incorrect'));
  });

  it('clears both password fields once the change succeeds', async () => {
    axiosAuthMock.patch.mockResolvedValue(axiosResponse({ message: 'ok' }));
    renderWithQuery(<AccountSection />);

    await userEvent.type(currentPassword(), 'oldsecret');
    await userEvent.type(newPassword(), 'newsecret');
    await userEvent.click(submit());

    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith('Password updated'));
    expect(currentPassword()).toHaveValue('');
    expect(newPassword()).toHaveValue('');
  });
});
