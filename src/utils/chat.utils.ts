import type { IMessage } from '@/types/chat.type';

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-EN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateLabel = (date: string) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-EN', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const groupMessagesByDate = (messages: IMessage[]) => {
  const groups: { label: string; messages: IMessage[] }[] = [];
  messages.forEach((message) => {
    const label = formatDateLabel(message.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.messages.push(message);
    } else {
      groups.push({ label, messages: [message] });
    }
  });
  return groups;
};

export const formatLastSeen = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000 / 60);

  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return d.toLocaleDateString();
};
