import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '@/components/dashboard/header/ProfileHeader';
import type { TypeUserResponse } from '@/types/user.type';

const user: TypeUserResponse = {
  id: 'u1',
  email: 'ivan@example.com',
  username: 'ivan',
  name: 'Ivan',
  bio: 'building bird',
  avatar: 'https://cdn.test/a.png',
  _count: { followers: 2, following: 1 },
};

describe('ProfileHeader', () => {
  it('renders the name, handle and bio', () => {
    render(<ProfileHeader user={user} />);

    expect(screen.getByText('Ivan')).toBeInTheDocument();
    expect(screen.getByText('@ivan')).toBeInTheDocument();
    expect(screen.getByText('building bird')).toBeInTheDocument();
  });

  it('falls back to the handle when the user has no name', () => {
    render(<ProfileHeader user={{ ...user, name: undefined }} />);

    expect(screen.getByText('ivan')).toBeInTheDocument();
    expect(screen.getByText('@ivan')).toBeInTheDocument();
  });

  it('omits the bio when it is empty', () => {
    render(<ProfileHeader user={{ ...user, bio: undefined }} />);

    expect(screen.queryByText('building bird')).not.toBeInTheDocument();
  });

  it('renders follower and following counts', () => {
    render(<ProfileHeader user={user} />);

    expect(screen.getByText('Following').previousSibling).toHaveTextContent('1');
    expect(screen.getByText('Followers').previousSibling).toHaveTextContent('2');
  });

  it('shows zero when the API omits the counts', () => {
    render(<ProfileHeader user={{ ...user, _count: undefined }} />);

    expect(screen.getByText('Following').previousSibling).toHaveTextContent('0');
    expect(screen.getByText('Followers').previousSibling).toHaveTextContent('0');
  });

  it('renders the actions slot', () => {
    render(<ProfileHeader user={user} actions={<button>Follow</button>} />);

    expect(screen.getByRole('button', { name: 'Follow' })).toBeInTheDocument();
  });

  it('renders no actions when none are given', () => {
    render(<ProfileHeader user={user} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
