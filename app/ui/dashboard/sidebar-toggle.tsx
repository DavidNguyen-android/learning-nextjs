'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { toggleSidebar } from '@/app/store/slices/uiSlice';
import {
    Bars3Icon,
    ChevronDoubleLeftIcon,
} from '@heroicons/react/24/outline';

export default function SidebarToggle() {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <button
      onClick={() => dispatch(toggleSidebar())}
      className="hidden md:flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed ? (
        <Bars3Icon className="w-6" />
      ) : (
        <>
          <ChevronDoubleLeftIcon className="w-6" />
          <span>Collapse</span>
        </>
      )}
    </button>
  );
}
