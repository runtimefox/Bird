'use client';

import { Bird } from 'lucide-react';
import Link from 'next/link';
import { useMemo, type FC } from 'react';
import { LogoutButton } from './LogoutButton';
import { MENU } from './menu.data';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import { DASHBOARD } from '@/config/menu.config';

export const SideBar: FC = () => {
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
  });

  const unreadCount = useMemo(() => data?.data.filter((n) => !n.read).length ?? 0, [data]);

  return (
    <aside>
      <div>
        <Link
          href="/dashboard/home"
          className="flex items-center gap-2.5 p-[1.4rem] border-b border-b-border"
        >
          <Bird size={38} />
          <span className="text-2xl font-chirp-bold relative">Bird</span>
        </Link>
        <div className="p-3 relative flex flex-col flex-1">
          <LogoutButton />
          {MENU.map((item) =>
            item.link === DASHBOARD.NOTIFICATION ? (
              <Link
                key={item.name}
                href={item.link}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="relative">
                  <item.icon />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="font-chirp-bold">{item.name}</span>
              </Link>
            ) : (
              <Link
                key={item.name}
                href={item.link}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <item.icon />
                <span className="font-chirp-bold">{item.name}</span>
              </Link>
            ),
          )}
        </div>
        <div className="p-3">
          <Link href="/compose/post" className="block p-3">
            <Button className="w-full rounded-full py-6 text-base font-bold hover:opacity-90">
              Make post
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
};
