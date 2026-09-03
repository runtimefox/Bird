import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import type { IPost } from '@/types/post.type';
import { makePost } from '../helpers/fixtures';
import { renderWithQuery } from '../helpers/query-wrapper';

const { Posts } = await import('@/components/dashboard/posts/Posts');

const page = (posts: IPost[], total: number) => axiosResponse({ data: posts, total });

const servePages = (pages: { data: IPost[]; total: number }[]) => {
  let call = 0;
  axiosAuthMock.get.mockImplementation(async (...args: unknown[]) => {
    const url = args[0] as string;
    if (!url.startsWith('/posts')) return axiosResponse(undefined);
    const next = pages[Math.min(call, pages.length - 1)];
    call += 1;
    return page(next.data, next.total);
  });
};

describe('Posts', () => {
  beforeEach(resetAxiosMocks);

  it('renders the first page of the feed', async () => {
    servePages([{ data: [makePost({ id: 'p1', content: 'First' })], total: 1 }]);
    renderWithQuery(<Posts activeTab="For you" />);

    await waitFor(() => expect(screen.getByText('First')).toBeInTheDocument());
  });

  it('reads the following feed on the Following tab', async () => {
    servePages([{ data: [], total: 0 }]);
    renderWithQuery(<Posts activeTab="Following" />);

    await waitFor(() =>
      expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/following', {
        params: { page: 1, limit: 10 },
      }),
    );
  });

  it('prompts to follow people when the following feed is empty', async () => {
    servePages([{ data: [], total: 0 }]);
    renderWithQuery(<Posts activeTab="Following" />);

    await waitFor(() =>
      expect(screen.getByText(/You aren't following anyone yet/)).toBeInTheDocument(),
    );
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
      { data: [makePost({ id: 'p1', content: 'Only one' })], total: 3 },
      { data: [makePost({ id: 'p2', content: 'Second page' })], total: 3 },
    ]);
    renderWithQuery(<Posts activeTab="For you" />);

    await waitFor(() =>
      expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/all', {
        params: { page: 2, limit: 10 },
      }),
    );

    globalThis.IntersectionObserver = original;
  });
});
