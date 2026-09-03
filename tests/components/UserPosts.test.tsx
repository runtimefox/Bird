import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { IPost } from '@/types/post.type';
import { makePost, makeUser } from '../helpers/fixtures';
import { renderWithQuery } from '../helpers/query-wrapper';

const { UserPosts } = await import('@/components/dashboard/posts/UserPosts');

const user = makeUser({ id: 'u1' });

const servePosts = (posts: IPost[]) =>
  axiosAuthMock.get.mockImplementation(async (...args: unknown[]) => {
    const url = args[0] as string;
    if (url.startsWith('/posts/user')) return axiosResponse(posts);
    return axiosResponse(user);
  });

const failPosts = (message: string) =>
  axiosAuthMock.get.mockImplementation(async (...args: unknown[]) => {
    const url = args[0] as string;
    if (url.startsWith('/posts/user')) throw { response: { data: { message } } };
    return axiosResponse(user);
  });

describe('UserPosts', () => {
  beforeEach(resetAxiosMocks);

  it('lists the posts', async () => {
    servePosts([makePost({ id: 'p1', content: 'Mine' })]);
    renderWithQuery(<UserPosts user={user} />);

    await waitFor(() => expect(screen.getByText('Mine')).toBeInTheDocument());
  });

  it('says so when there are none', async () => {
    servePosts([]);
    renderWithQuery(<UserPosts user={user} />);

    await waitFor(() => expect(screen.getByText('No posts yet')).toBeInTheDocument());
  });

  it('shows the api message instead of an empty profile when the request fails', async () => {
    failPosts('Profile is down');
    renderWithQuery(<UserPosts user={user} />);

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByText('Profile is down')).toBeInTheDocument();
    expect(screen.queryByText('No posts yet')).not.toBeInTheDocument();
  });

  it('recovers when the retry succeeds', async () => {
    failPosts('Profile is down');
    renderWithQuery(<UserPosts user={user} />);

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    servePosts([makePost({ id: 'p1', content: 'Back up' })]);
    await userEvent.click(screen.getByRole('button', { name: /Try again/ }));

    await waitFor(() => expect(screen.getByText('Back up')).toBeInTheDocument());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
