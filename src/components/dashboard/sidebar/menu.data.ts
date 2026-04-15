import { Bell, House, Settings, UserPen } from 'lucide-react';
import type { IMenuItem } from './menu.interface';
import { DASHBOARD } from '@/config/menu.config';

export const MENU: IMenuItem[] = [
  {
    icon: House,
    link: DASHBOARD.HOME,
    name: 'Home',
  },
  {
    icon: Bell,
    link: DASHBOARD.NOTIFICATION,
    name: 'Notification',
  },
  {
    icon: UserPen,
    link: DASHBOARD.PROFILE,
    name: 'Profile',
  },
  {
    icon: Settings,
    link: DASHBOARD.SETTINGS,
    name: 'Settings',
  },
];
