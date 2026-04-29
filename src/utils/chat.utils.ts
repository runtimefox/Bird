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
