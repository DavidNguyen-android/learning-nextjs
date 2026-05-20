'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
    clearInvoiceSelection,
    selectAllInvoices,
    toggleInvoiceSelection,
} from '@/app/store/slices/invoiceFiltersSlice';
import { openDeleteModal } from '@/app/store/slices/uiSlice';

export function InvoiceCheckbox({ invoiceId }: { invoiceId: string }) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) =>
    state.invoiceFilters.selectedInvoiceIds.includes(invoiceId),
  );

  return (
    <input
      type="checkbox"
      checked={selected}
      onChange={() => dispatch(toggleInvoiceSelection(invoiceId))}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
  );
}

export function SelectAllCheckbox({ invoiceIds }: { invoiceIds: string[] }) {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector(
    (state) => state.invoiceFilters.selectedInvoiceIds,
  );
  const allSelected =
    invoiceIds.length > 0 && invoiceIds.every((id) => selectedIds.includes(id));
  const someSelected =
    invoiceIds.some((id) => selectedIds.includes(id)) && !allSelected;

  return (
    <input
      type="checkbox"
      checked={allSelected}
      ref={(el) => {
        if (el) el.indeterminate = someSelected;
      }}
      onChange={() => {
        if (allSelected) {
          dispatch(clearInvoiceSelection());
        } else {
          dispatch(selectAllInvoices(invoiceIds));
        }
      }}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
  );
}

export function BulkActionBar() {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector(
    (state) => state.invoiceFilters.selectedInvoiceIds,
  );

  if (selectedIds.length === 0) return null;

  return (
    <div className="mt-4 flex items-center gap-4 rounded-lg bg-blue-50 p-3 border border-blue-200">
      <span className="text-sm font-medium text-blue-800">
        {selectedIds.length} invoice{selectedIds.length > 1 ? 's' : ''} selected
      </span>
      <button
        onClick={() => {
          dispatch(
            openDeleteModal({
              invoiceId: selectedIds.join(','),
              invoiceName: `${selectedIds.length} selected invoices`,
            }),
          );
        }}
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
      >
        Delete Selected
      </button>
      <button
        onClick={() => dispatch(clearInvoiceSelection())}
        className="text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        Clear Selection
      </button>
    </div>
  );
}
