'use client';

import { useAppDispatch } from '@/app/store/hooks';
import { openDeleteModal } from '@/app/store/slices/uiSlice';
import { TrashIcon } from '@heroicons/react/24/outline';

export function DeleteInvoiceButton({
  id,
  name,
}: {
  id: string;
  name?: string;
}) {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() =>
        dispatch(openDeleteModal({ invoiceId: id, invoiceName: name ?? '' }))
      }
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}
