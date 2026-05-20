import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StatusFilter = 'all' | 'pending' | 'paid';
type SortField = 'date' | 'amount' | 'name';
type SortDirection = 'asc' | 'desc';

interface InvoiceFiltersState {
  statusFilter: StatusFilter;
  sortField: SortField;
  sortDirection: SortDirection;
  selectedInvoiceIds: string[];
}

const initialState: InvoiceFiltersState = {
  statusFilter: 'all',
  sortField: 'date',
  sortDirection: 'desc',
  selectedInvoiceIds: [],
};

const invoiceFiltersSlice = createSlice({
  name: 'invoiceFilters',
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<StatusFilter>) {
      state.statusFilter = action.payload;
    },
    setSort(state, action: PayloadAction<{ field: SortField; direction: SortDirection }>) {
      state.sortField = action.payload.field;
      state.sortDirection = action.payload.direction;
    },
    toggleSortDirection(state) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    },
    toggleInvoiceSelection(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.selectedInvoiceIds.indexOf(id);
      if (index >= 0) {
        state.selectedInvoiceIds.splice(index, 1);
      } else {
        state.selectedInvoiceIds.push(id);
      }
    },
    selectAllInvoices(state, action: PayloadAction<string[]>) {
      state.selectedInvoiceIds = action.payload;
    },
    clearInvoiceSelection(state) {
      state.selectedInvoiceIds = [];
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setStatusFilter,
  setSort,
  toggleSortDirection,
  toggleInvoiceSelection,
  selectAllInvoices,
  clearInvoiceSelection,
  resetFilters,
} = invoiceFiltersSlice.actions;

export default invoiceFiltersSlice.reducer;
