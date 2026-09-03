'use client';

import { notificationService } from '@/services/notification.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import type { FC } from 'react';
import type { INotification } from '@/types/notification.type';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ErrorState';

export const Notification: FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: () => notificationService.deleteNotification(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications: INotification[] = data?.data ?? [];

  if (isLoading)
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-border p-4 flex gap-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        ))}
      </div>
    );

  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-chirp-bold">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={() => markAsRead()}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">No notifications yet</div>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 p-4 border-b border-border transition-colors ${!n.read ? 'bg-white/5' : ''}`}
        >
          <Image
            src={n.from.avatar ?? '/profile.png'}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover shrink-0"
            alt="avatar"
          />
          <div>
            <span className="font-chirp-bold text-sm">@{n.from.username}</span>
            <p className="text-sm text-gray-300">{n.message}</p>
            <span className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
