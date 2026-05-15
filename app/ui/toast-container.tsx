'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { removeToast, Toast } from '@/app/store/slices/uiSlice';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useEffect } from 'react';

const TOAST_DURATION = 4000;

const iconMap: Record<Toast['type'], React.ComponentType<{ className?: string }>> = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  info: InformationCircleIcon,
};

const colorMap: Record<Toast['type'], string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

function ToastItem({ toast }: { toast: Toast }) {
  const dispatch = useAppDispatch();
  const Icon = iconMap[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  return (
    <div
      className={clsx(
        'flex items-center gap-3 rounded-lg border p-4 shadow-md animate-in slide-in-from-right',
        colorMap[toast.type],
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="flex-shrink-0 hover:opacity-70"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector((state) => state.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
