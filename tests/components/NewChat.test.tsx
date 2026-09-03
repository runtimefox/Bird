import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import { makeUser } from '../helpers/fixtures';
import { renderWithQuery } from '../helpers/query-wrapper';

const { NewChat } = await import('@/components/dashboard/chat/NewChat');

const noop = () => {};

describe('NewChat', () => {
  beforeEach(resetAxiosMocks);

  it('searches nothing until something is typed', async () => {
    renderWithQuery(<NewChat searchQuery="" setSearchQuery={noop} onSelect={noop} />);

    await waitFor(() => expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument());
    expect(axiosAuthMock.get).not.toHaveBeenCalled();
    expect(screen.queryByText('No users found')).not.toBeInTheDocument();
  });

  it('lists the matches', async () => {
    axiosAuthMock.get.mockResolvedValue(axiosResponse([makeUser({ id: 'u2', name: 'Anna' })]));
    renderWithQuery(<NewChat searchQuery="anna" setSearchQuery={noop} onSelect={noop} />);

    await waitFor(() => expect(screen.getByText('Anna')).toBeInTheDocument());
  });

  it('says so when the search finds nobody', async () => {
    axiosAuthMock.get.mockResolvedValue(axiosResponse([]));
    renderWithQuery(<NewChat searchQuery="zzz" setSearchQuery={noop} onSelect={noop} />);

    await waitFor(() => expect(screen.getByText('No users found')).toBeInTheDocument());
  });
});
