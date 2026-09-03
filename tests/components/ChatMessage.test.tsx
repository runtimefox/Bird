import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '@/components/dashboard/chat/ChatMessage';
import type { IMessage } from '@/types/chat.type';

const message: IMessage = {
  id: 'm1',
  content: 'hey there',
  createdAt: new Date(2026, 0, 15, 14, 30).toISOString(),
  conversationId: 'c1',
  senderId: 'u2',
  sender: {
    id: 'u2',
    email: 'other@example.com',
    password: '',
    username: 'other',
    avatar: 'https://cdn.test/other.png',
  },
};

describe('ChatMessage', () => {
  it('renders the message content', () => {
    render(<ChatMessage message={message} isMe={false} />);

    expect(screen.getByText('hey there')).toBeInTheDocument();
  });

  it('renders the send time', () => {
    render(<ChatMessage message={message} isMe={false} />);

    expect(screen.getByText(/^\d{1,2}:\d{2}(\s?[AP]M)?$/i)).toBeInTheDocument();
  });

  it("shows the sender avatar on the other person's messages", () => {
    render(<ChatMessage message={message} isMe={false} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.test/other.png');
  });

  it('hides the avatar on your own messages', () => {
    render(<ChatMessage message={message} isMe />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('aligns your own messages to the right and theirs to the left', () => {
    const { container, rerender } = render(<ChatMessage message={message} isMe />);
    expect(container.firstChild).toHaveClass('justify-end');

    rerender(<ChatMessage message={message} isMe={false} />);
    expect(container.firstChild).toHaveClass('justify-start');
  });

  it('falls back to the placeholder avatar when the sender has none', () => {
    const noAvatar: IMessage = { ...message, sender: { ...message.sender, avatar: undefined } };
    render(<ChatMessage message={noAvatar} isMe={false} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', '/profile.png');
  });
});
