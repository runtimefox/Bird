import { describe, expect, it } from 'bun:test';
import {
  formatDateLabel,
  formatLastSeen,
  formatTime,
  groupMessagesByDate,
} from '@/utils/chat.utils';
import type { IMessage } from '@/types/chat.type';

const makeMessage = (id: string, createdAt: Date): IMessage => ({
  id,
  content: `message ${id}`,
  createdAt: createdAt.toISOString(),
  conversationId: 'conversation-1',
  senderId: 'user-1',
  sender: {
    id: 'user-1',
    email: 'user@example.com',
    password: '',
    username: 'user',
  },
});

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000);

describe('formatTime', () => {
  it('renders hours and minutes', () => {
    expect(formatTime(new Date(2026, 0, 15, 14, 30).toISOString())).toMatch(
      /^\d{1,2}:\d{2}(\s?[AP]M)?$/i,
    );
  });

  it('zero-pads a single-digit minute', () => {
    expect(formatTime(new Date(2026, 0, 15, 9, 5).toISOString())).toContain(':05');
  });
});

describe('formatDateLabel', () => {
  it('labels today', () => {
    expect(formatDateLabel(new Date().toISOString())).toBe('Today');
  });

  it('labels yesterday', () => {
    expect(formatDateLabel(daysAgo(1).toISOString())).toBe('Yesterday');
  });

  it('falls back to a full date for anything older', () => {
    const label = formatDateLabel(new Date(2020, 4, 17).toISOString());
    expect(label).not.toBe('Today');
    expect(label).not.toBe('Yesterday');
    expect(label).toContain('2020');
  });
});

describe('groupMessagesByDate', () => {
  it('returns no groups for an empty list', () => {
    expect(groupMessagesByDate([])).toEqual([]);
  });

  it('puts messages from the same day into one group', () => {
    const groups = groupMessagesByDate([
      makeMessage('1', new Date()),
      makeMessage('2', new Date()),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('Today');
    expect(groups[0].messages.map((m) => m.id)).toEqual(['1', '2']);
  });

  it('splits messages across days and keeps chronological order', () => {
    const groups = groupMessagesByDate([
      makeMessage('1', daysAgo(1)),
      makeMessage('2', daysAgo(1)),
      makeMessage('3', new Date()),
    ]);

    expect(groups.map((g) => g.label)).toEqual(['Yesterday', 'Today']);
    expect(groups[0].messages.map((m) => m.id)).toEqual(['1', '2']);
    expect(groups[1].messages.map((m) => m.id)).toEqual(['3']);
  });

  it('only merges into the previous group, so a repeated label starts a new group', () => {
    const groups = groupMessagesByDate([
      makeMessage('1', new Date()),
      makeMessage('2', daysAgo(1)),
      makeMessage('3', new Date()),
    ]);

    expect(groups.map((g) => g.label)).toEqual(['Today', 'Yesterday', 'Today']);
  });
});

describe('formatLastSeen', () => {
  it('reports "just now" under a minute', () => {
    expect(formatLastSeen(new Date().toISOString())).toBe('just now');
  });

  it('reports minutes under an hour', () => {
    expect(formatLastSeen(minutesAgo(30).toISOString())).toBe('30m ago');
  });

  it('reports hours under a day', () => {
    expect(formatLastSeen(minutesAgo(3 * 60).toISOString())).toBe('3h ago');
  });

  it('falls back to a date past 24 hours', () => {
    const result = formatLastSeen(daysAgo(3).toISOString());
    expect(result).not.toMatch(/ago$/);
    expect(result).toContain(String(daysAgo(3).getFullYear()));
  });
});
