import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { IPost } from '@/types/post.type';
import { makePost, makeUser } from '../helpers/fixtures';
import { renderWithQuery } from '../helpers/query-wrapper';

const { UserPosts } = await import('@/components/dashboard/posts/UserPosts');

const user = makeUser({ id: 'u1' });

const servePosts = (posts: IPost[], total = posts.length) =>
  axiosAuthMock.get.mockImplementation(async (...args: unknown[]) => {
    const url = args[0] as string;
    if (url.startsWith('/posts/user')) return axiosResponse({ data: posts, total });
    return axiosResponse(user);
  });

const servePages = (pages: { data: IPost[]; total: number }[]) => {
  let call = 0;
  axiosAuthMock.get.mockImplementation(async (...args: unknown[]) => {
    const url = args[0] as string;
    if (!url.startsWith('/posts/user')) return axiosResponse(user);
    const next = pages[Math.min(call, pages.length - 1)];
    call += 1;
    return axiosResponse(next);
  });
};

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

  it('asks for the first page of the user feed', async () => {
    servePosts([makePost({ id: 'p1', content: 'Mine' })]);
    renderWithQuery(<UserPosts user={user} />);

    await waitFor(() =>
      expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/user/u1', {
        params: { page: 1, limit: 10 },
      }),
    );
  });

  it('says so when there are none', async () => {
    servePosts([]);
    renderWithQuery(<UserPosts user={user} />);

    await waitFor(() => expect(screen.getByText('No posts yet')).toBeInTheDocument());
  });

  it('counts loaded posts rather than assuming a full page', async () => {
    const original = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe() {
        this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;

    servePages([
      { data: [makePost({ id: 'p1', content: 'Only one' })], total: 2 },
      { data: [makePost({ id: 'p2', content: 'Second page' })], total: 2 },
    ]);
    renderWithQuery(<UserPosts user={user} />);

    await waitFor(() => expect(screen.getByText('Second page')).toBeInTheDocument());

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/user/u1', {
      params: { page: 2, limit: 10 },
    });
    expect(screen.getByText('Only one')).toBeInTheDocument();

    globalThis.IntersectionObserver = original;
  });

  it('stops paging once every post is loaded', async () => {
    const original = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe() {
        this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;

    servePosts([makePost({ id: 'p1', content: 'Only one' })], 1);
    renderWithQuery(<UserPosts user={user} />);

    await waitFor(() => expect(screen.getByText('Only one')).toBeInTheDocument());
    expect(axiosAuthMock.get).not.toHaveBeenCalledWith('/posts/user/u1', {
      params: { page: 2, limit: 10 },
    });

    globalThis.IntersectionObserver = original;
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
