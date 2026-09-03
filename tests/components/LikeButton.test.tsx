import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makePost, makeUser } from '../helpers/fixtures';
import { renderWithQuery } from '../helpers/query-wrapper';

const { LikeButton } = await import('@/components/dashboard/LikeButton');

const signedInAs = (id: string) =>
  axiosAuthMock.get.mockResolvedValue(axiosResponse(makeUser({ id })));

describe('LikeButton', () => {
  beforeEach(resetAxiosMocks);

  it('renders the like count', () => {
    signedInAs('u1');
    renderWithQuery(<LikeButton post={makePost({ _count: { likes: 7, comments: 0 } })} />);

    expect(screen.getByRole('button')).toHaveTextContent('7');
  });

  it('fills the heart when the current user is among the likes', async () => {
    signedInAs('u1');
    const post = makePost({ likes: [{ id: 'l1', userId: 'u1' }] });

    const { container } = renderWithQuery(<LikeButton post={post} />);

    await waitFor(() => expect(container.querySelector('.fill-red-500')).not.toBeNull());
  });

  it('leaves the heart empty when someone else liked it', async () => {
    signedInAs('u1');
    const post = makePost({ likes: [{ id: 'l1', userId: 'u2' }] });

    const { container } = renderWithQuery(<LikeButton post={post} />);

    await waitFor(() => expect(axiosAuthMock.get).toHaveBeenCalled());
    expect(container.querySelector('.fill-red-500')).toBeNull();
  });

  it('likes a post the current user has not liked yet', async () => {
    signedInAs('u1');
    renderWithQuery(<LikeButton post={makePost()} />);

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(axiosAuthMock.post).toHaveBeenCalledWith('/posts/p1/like'));
  });

  it('unlikes a post the current user already liked', async () => {
    signedInAs('u1');
    const post = makePost({ likes: [{ id: 'l1', userId: 'u1' }] });
    const { container } = renderWithQuery(<LikeButton post={post} />);

    await waitFor(() => expect(container.querySelector('.fill-red-500')).not.toBeNull());
    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(axiosAuthMock.delete).toHaveBeenCalledWith('/posts/p1/unlike'));
  });

  it('treats the post as unliked while the profile is still loading', () => {
    signedInAs('u1');
    const post = makePost({ likes: [{ id: 'l1', userId: 'u1' }] });

    const { container } = renderWithQuery(<LikeButton post={post} />);

    expect(container.querySelector('.fill-red-500')).toBeNull();
  });
});
