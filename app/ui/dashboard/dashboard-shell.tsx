'use client';

import { useAppSelector } from '@/app/store/hooks';
import clsx from 'clsx';

export default function DashboardShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div
        className={clsx(
          'w-full flex-none transition-all duration-300',
          collapsed ? 'md:w-20' : 'md:w-64',
        )}
      >
        {sidebar}
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
