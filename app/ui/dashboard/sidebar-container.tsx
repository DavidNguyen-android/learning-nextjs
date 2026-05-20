'use client';

import { useAppSelector } from '@/app/store/hooks';
import clsx from 'clsx';

export default function SidebarContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <div
      className={clsx(
        'flex h-full flex-col px-3 py-4 md:px-2 transition-all duration-300',
        collapsed && 'md:items-center',
      )}
      data-collapsed={collapsed}
    >
      {children}
    </div>
  );
}
