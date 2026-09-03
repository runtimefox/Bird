import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '@/components/ErrorState';

describe('ErrorState', () => {
  it('shows the api message', () => {
    render(<ErrorState error={{ response: { data: { message: 'Post not found' } } }} />);

    expect(screen.getByText('Post not found')).toBeInTheDocument();
  });

  it('shows the first entry of a validation array', () => {
    render(<ErrorState error={{ response: { data: { message: ['Too short', 'Too plain'] } } }} />);

    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('falls back to the axios message', () => {
    render(<ErrorState error={{ message: 'Network Error' }} />);

    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });

  it('is announced to assistive tech', () => {
    render(<ErrorState error={{ message: 'Network Error' }} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('takes a custom title', () => {
    render(<ErrorState error={{ message: 'Network Error' }} title="Feed unavailable" />);

    expect(screen.getByText('Feed unavailable')).toBeInTheDocument();
  });

  it('renders no retry button without a handler', () => {
    render(<ErrorState error={{ message: 'Network Error' }} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('retries on demand', async () => {
    const onRetry = mock(() => {});
    render(<ErrorState error={{ message: 'Network Error' }} onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: /Try again/ }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
