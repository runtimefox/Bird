import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makePost, makeUser } from '../helpers/fixtures';
import { renderWithQuery } from '../helpers/query-wrapper';

const { PostCard } = await import('@/components/dashboard/posts/PostCard');
const { useCommentModalStore } = await import('@/store/commentModal.store');

describe('PostCard', () => {
  beforeEach(() => {
    resetAxiosMocks();
    axiosAuthMock.get.mockResolvedValue(axiosResponse(makeUser({ id: 'u1' })));
    useCommentModalStore.getState().close();
  });

  it('renders the body, author and handle', () => {
    renderWithQuery(<PostCard post={makePost()} />);

    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('Ivan')).toBeInTheDocument();
    expect(screen.getByText('@ivan')).toBeInTheDocument();
  });

  it('links the card to the post and the author to their profile', () => {
    renderWithQuery(<PostCard post={makePost()} />);

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toContain('/posts/p1');
    expect(hrefs).toContain('/dashboard/profile/u1');
  });

  it('never nests one link inside another', () => {
    const { container } = renderWithQuery(
      <PostCard
        post={makePost({ image: 'https://cdn.test/p.png' })}
        onDelete={() => {}}
        showDelete
      />,
    );

    for (const link of container.querySelectorAll('a')) {
      expect(link.querySelector('a')).toBeNull();
    }
  });

  it('gives the card link an accessible name', () => {
    renderWithQuery(<PostCard post={makePost()} />);

    expect(screen.getByRole('link', { name: 'Post by @ivan' })).toHaveAttribute(
      'href',
      '/posts/p1',
    );
  });

  it('renders the creation date in long form', () => {
    renderWithQuery(<PostCard post={makePost()} />);

    expect(screen.getByText('January 15, 2026')).toBeInTheDocument();
  });

  it('renders the attached image only when the post has one', () => {
    const { rerender } = renderWithQuery(<PostCard post={makePost()} />);
    expect(screen.queryByAltText('post image')).not.toBeInTheDocument();

    rerender(<PostCard post={makePost({ image: 'https://cdn.test/post.png' })} />);
    expect(screen.getByAltText('post image')).toBeInTheDocument();
  });

  it('shows the comment count', () => {
    renderWithQuery(<PostCard post={makePost({ _count: { likes: 0, comments: 5 } })} />);

    expect(screen.getByRole('button', { name: /5/ })).toBeInTheDocument();
  });

  it('opens the comment modal on the post it was clicked from', async () => {
    const post = makePost({ _count: { likes: 0, comments: 5 } });
    renderWithQuery(<PostCard post={post} />);

    await userEvent.click(screen.getByRole('button', { name: /5/ }));

    await waitFor(() => expect(useCommentModalStore.getState().post).toEqual(post));
  });

  it('hides the delete button unless the parent asks for it', () => {
    renderWithQuery(<PostCard post={makePost()} onDelete={() => {}} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('reports the deleted post id', async () => {
    const onDelete = mock<(postId: string) => void>(() => {});
    renderWithQuery(<PostCard post={makePost()} onDelete={onDelete} showDelete />);

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[buttons.length - 1]);

    expect(onDelete).toHaveBeenCalledWith('p1');
  });

  it('renders no delete button without a handler, even when asked to show one', () => {
    renderWithQuery(<PostCard post={makePost()} showDelete />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
