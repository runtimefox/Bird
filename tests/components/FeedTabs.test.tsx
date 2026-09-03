import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedTabs } from '@/components/dashboard/FeedTabs';

describe('FeedTabs', () => {
  it('renders both feed tabs', () => {
    render(<FeedTabs active="For you" onTabChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'For you' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Following' })).toBeInTheDocument();
  });

  it('reports the clicked tab', async () => {
    const onTabChange = mock(() => {});
    render(<FeedTabs active="For you" onTabChange={onTabChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Following' }));

    expect(onTabChange).toHaveBeenCalledTimes(1);
    expect(onTabChange).toHaveBeenCalledWith('Following');
  });

  it('reports the active tab too, so the parent decides whether to re-fetch', async () => {
    const onTabChange = mock(() => {});
    render(<FeedTabs active="For you" onTabChange={onTabChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'For you' }));

    expect(onTabChange).toHaveBeenCalledWith('For you');
  });

  it('marks only the active tab as selected', () => {
    render(<FeedTabs active="Following" onTabChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Following' }).className).toContain(
      'font-chirp-bold',
    );
    expect(screen.getByRole('button', { name: 'For you' }).className).toContain('text-gray-500');
  });
});
