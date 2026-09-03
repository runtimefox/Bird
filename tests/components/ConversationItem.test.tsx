import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConversationItem } from '@/components/dashboard/chat/ConversationItem';
import { makeConversation, makeMessage } from '../helpers/fixtures';

const render_ = (props: Partial<Parameters<typeof ConversationItem>[0]> = {}) =>
  render(
    <ConversationItem
      conversation={makeConversation()}
      currentUserId="u1"
      onlineUsers={[]}
      onClick={() => {}}
      {...props}
    />,
  );

describe('ConversationItem', () => {
  it('shows the other member, not the current user', () => {
    render_();

    expect(screen.getByText('Anna')).toBeInTheDocument();
    expect(screen.queryByText('Ivan')).not.toBeInTheDocument();
  });

  it('falls back to the handle when the other member has no name', () => {
    const conversation = makeConversation();
    conversation.members[1].user.name = undefined;

    render_({ conversation });

    expect(screen.getByText('anna')).toBeInTheDocument();
  });

  it('previews the last message', () => {
    render_();

    expect(screen.getByText('Hey there')).toBeInTheDocument();
  });

  it('cuts the preview at ten words', () => {
    const conversation = makeConversation({
      messages: [
        makeMessage({ content: 'one two three four five six seven eight nine ten eleven' }),
      ],
    });

    render_({ conversation });

    expect(
      screen.getByText('one two three four five six seven eight nine ten'),
    ).toBeInTheDocument();
  });

  it('says so when the conversation is empty', () => {
    render_({ conversation: makeConversation({ messages: [] }) });

    expect(screen.getByText('No messages yet')).toBeInTheDocument();
  });

  it('marks the other member online only when they are in the list', () => {
    const { container: offline } = render_({ onlineUsers: ['u3'] });
    expect(offline.querySelector('.bg-green-500')).toBeNull();

    const { container: online } = render_({ onlineUsers: ['u2'] });
    expect(online.querySelector('.bg-green-500')).not.toBeNull();
  });

  it('hides the badge when everything is read', () => {
    render_({ conversation: makeConversation({ unreadCount: 0 }) });

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows the unread count', () => {
    render_({ conversation: makeConversation({ unreadCount: 3 }) });

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('caps the unread badge at 9+', () => {
    render_({ conversation: makeConversation({ unreadCount: 42 }) });

    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('reports a click', async () => {
    const onClick = mock(() => {});
    render_({ onClick });

    await userEvent.click(screen.getByText('Anna'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
