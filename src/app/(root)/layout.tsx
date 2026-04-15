import { DashboardClient } from '@/components/dashboard/DashBoardClient';
import type { ReactNode } from 'react';

export default function HomeLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
  return <DashboardClient modal={modal}>{children}</DashboardClient>;
}
