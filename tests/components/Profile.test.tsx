import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeUser } from '../helpers/fixtures';
import { renderWithQuery } from '../helpers/query-wrapper';

const { Profile } = await import('@/app/(root)/dashboard/profile/Profile');

const serveProfile = () =>
  axiosAuthMock.get.mockImplementation(async (...args: unknown[]) => {
    const url = args[0] as string;
    if (url.startsWith('/posts')) return axiosResponse([]);
    return axiosResponse(makeUser({ name: 'Ivan' }));
  });

const failProfile = (message: string) =>
  axiosAuthMock.get.mockImplementation(async (...args: unknown[]) => {
    const url = args[0] as string;
    if (url.startsWith('/posts')) return axiosResponse([]);
    throw { response: { data: { message } } };
  });

describe('Profile', () => {
  beforeEach(resetAxiosMocks);

  it('renders the signed-in profile', async () => {
    serveProfile();
    renderWithQuery(<Profile />);

    await waitFor(() => expect(screen.getByText('Ivan')).toBeInTheDocument());
  });

  it('links to settings through the route config', async () => {
    serveProfile();
    renderWithQuery(<Profile />);

    await waitFor(() => expect(screen.getByText('Ivan')).toBeInTheDocument());
    const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/dashboard/settings');
  });

  it('reports a failed request instead of claiming the user is missing', async () => {
    failProfile('Session expired');
    renderWithQuery(<Profile />);

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByText('Session expired')).toBeInTheDocument();
    expect(screen.queryByText('User not found')).not.toBeInTheDocument();
  });

  it('recovers when the retry succeeds', async () => {
    failProfile('Session expired');
    renderWithQuery(<Profile />);

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    serveProfile();
    await userEvent.click(screen.getByRole('button', { name: /Try again/ }));

    await waitFor(() => expect(screen.getByText('Ivan')).toBeInTheDocument());
  });
});
