'use client';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useNotifications } from '@/hooks/useNotifications';
import { SideBar } from '@/components/dashboard/sidebar/SideBar';
import { RightSideBar } from './sidebar/RightSideBar';
import { memo } from 'react';
import { CommentModalRoot } from '@/components/modal/CommentModalRoot';
export const MemoRightSideBar = memo(RightSideBar);

export const DashboardClient = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  const { data: user } = useGetProfile();
  useNotifications(user?.data.id ?? '');

  return (
    <>
      <div className="min-h-screen grid grid-cols-[275px_1fr_400px] w-full divide-x divide-border font-chirp-regular">
        <aside className="sticky top-0 h-screen overflow-y-auto">
          <SideBar />
        </aside>
        <main>{children}</main>
        <aside className="sticky top-0 h-screen">
          <MemoRightSideBar />
        </aside>
        {modal}
      </div>
      <CommentModalRoot />
    </>
  );
};
