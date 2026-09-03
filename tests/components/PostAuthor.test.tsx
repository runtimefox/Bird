import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { PostAuthor } from '@/components/dashboard/posts/PostAuthor';

describe('PostAuthor', () => {
  it('renders the display name and the @handle', () => {
    render(<PostAuthor id="u1" avatar="https://cdn.test/a.png" name="Ivan" username="ivan" />);

    expect(screen.getByText('Ivan')).toBeInTheDocument();
    expect(screen.getByText('@ivan')).toBeInTheDocument();
  });

  it('links to the author profile', () => {
    render(<PostAuthor id="u1" avatar={null} name="Ivan" username="ivan" />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/dashboard/profile/u1');
  });

  it('uses the given avatar', () => {
    render(<PostAuthor id="u1" avatar="https://cdn.test/a.png" name="Ivan" username="ivan" />);

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.test/a.png');
  });

  it('falls back to the placeholder avatar when there is none', () => {
    render(<PostAuthor id="u1" avatar={null} name="Ivan" username="ivan" />);

    expect(screen.getByRole('img')).toHaveAttribute('src', '/profile.png');
  });

  it('still renders the handle when the user has no name', () => {
    render(<PostAuthor id="u1" avatar={undefined} name={undefined} username="ivan" />);

    expect(screen.getByText('@ivan')).toBeInTheDocument();
  });
});
