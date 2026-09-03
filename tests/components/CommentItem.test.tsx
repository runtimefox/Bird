import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { CommentItem } from '@/components/dashboard/comments/CommentItem';
import { makeComment } from '../helpers/fixtures';

describe('CommentItem', () => {
  it('renders the author, the handle and the body', () => {
    render(<CommentItem comment={makeComment()} />);

    expect(screen.getByText('Anna')).toBeInTheDocument();
    expect(screen.getByText('@anna')).toBeInTheDocument();
    expect(screen.getByText('Nice post')).toBeInTheDocument();
  });

  it('links both the avatar and the name to the author profile', () => {
    render(<CommentItem comment={makeComment()} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveAttribute('href', '/dashboard/profile/u2');
    }
  });

  it('falls back to the placeholder avatar', () => {
    render(
      <CommentItem
        comment={makeComment({ author: { ...makeComment().author, avatar: undefined } })}
      />,
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', '/profile.png');
  });

  it('shows the creation date', () => {
    render(<CommentItem comment={makeComment({ createdAt: '2026-01-15T10:05:00Z' })} />);

    expect(
      screen.getByText(new Date('2026-01-15T10:05:00Z').toLocaleDateString()),
    ).toBeInTheDocument();
  });
});
