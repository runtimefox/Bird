import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { PostImage } from '@/components/dashboard/posts/PostImage';

describe('PostImage', () => {
  it('renders the image', () => {
    render(<PostImage src="https://cdn.test/post.png" />);

    expect(screen.getByAltText('post image')).toHaveAttribute('src', 'https://cdn.test/post.png');
  });

  it('paints a blurred copy behind it from the same source', () => {
    const { container } = render(<PostImage src="https://cdn.test/post.png" />);

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(2);
    expect(images[0].className).toContain('blur-xl');
  });

  it('hides the blurred backdrop from assistive tech', () => {
    const { container } = render(<PostImage src="https://cdn.test/post.png" />);

    expect(container.querySelectorAll('img')[0]).toHaveAttribute('aria-hidden');
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('keeps the foreground image uncropped', () => {
    render(<PostImage src="https://cdn.test/post.png" />);

    expect(screen.getByAltText('post image').className).toContain('object-contain');
  });
});
