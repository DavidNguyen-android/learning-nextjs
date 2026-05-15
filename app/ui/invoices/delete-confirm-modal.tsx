'use client';

import { deleteInvoice } from '@/app/lib/actions';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addToast, closeDeleteModal } from '@/app/store/slices/uiSlice';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTransition } from 'react';

export default function DeleteConfirmModal() {
  const dispatch = useAppDispatch();
  const { open, invoiceId, invoiceName } = useAppSelector(
    (state) => state.ui.deleteModal,
  );
  const [isPending, startTransition] = useTransition();

  if (!open || !invoiceId) return null;

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await deleteInvoice(invoiceId);
        dispatch(
          addToast({ message: 'Invoice deleted successfully.', type: 'success' }),
        );
      } catch {
        dispatch(
          addToast({ message: 'Failed to delete invoice.', type: 'error' }),
        );
      }
      dispatch(closeDeleteModal());
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Invoice
          </h3>
        </div>
        <p className="mb-6 text-sm text-gray-600">
          Are you sure you want to delete the invoice
          {invoiceName ? ` for ${invoiceName}` : ''}? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => dispatch(closeDeleteModal())}
            disabled={isPending}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
