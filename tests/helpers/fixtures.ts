import type { IComment } from '@/types/comment.type';
import type { IConversation, IMessage } from '@/types/chat.type';
import type { IPost } from '@/types/post.type';
import type { IUser } from '@/types/user.type';

export const makeUser = (overrides: Partial<IUser> = {}): IUser => ({
  id: 'u1',
  email: 'ivan@test.dev',
  password: '',
  username: 'ivan',
  name: 'Ivan',
  avatar: 'https://cdn.test/ivan.png',
  ...overrides,
});

export const makePost = (overrides: Partial<IPost> = {}): IPost => ({
  id: 'p1',
  content: 'Hello world',
  authorId: 'u1',
  author: makeUser(),
  likes: [],
  _count: { likes: 0, comments: 0 },
  createdAt: new Date('2026-01-15T10:00:00Z'),
  updatedAt: new Date('2026-01-15T10:00:00Z'),
  ...overrides,
});

export const makeComment = (overrides: Partial<IComment> = {}): IComment => ({
  id: 'c1',
  content: 'Nice post',
  authorId: 'u2',
  postId: 'p1',
  author: { id: 'u2', name: 'Anna', username: 'anna', avatar: 'https://cdn.test/anna.png' },
  createdAt: '2026-01-15T10:05:00Z',
  updatedAt: '2026-01-15T10:05:00Z',
  ...overrides,
});

export const makeMessage = (overrides: Partial<IMessage> = {}): IMessage => ({
  id: 'm1',
  content: 'Hey there',
  createdAt: '2026-01-15T10:05:00Z',
  conversationId: 'conv1',
  senderId: 'u2',
  sender: makeUser({ id: 'u2', username: 'anna', name: 'Anna' }),
  ...overrides,
});

export const makeConversation = (overrides: Partial<IConversation> = {}): IConversation => ({
  id: 'conv1',
  createdAt: '2026-01-15T09:00:00Z',
  members: [
    { id: 'mem1', conversationId: 'conv1', userId: 'u1', user: makeUser() },
    {
      id: 'mem2',
      conversationId: 'conv1',
      userId: 'u2',
      user: makeUser({ id: 'u2', username: 'anna', name: 'Anna', avatar: undefined }),
    },
  ],
  messages: [makeMessage()],
  unreadCount: 0,
  ...overrides,
});
