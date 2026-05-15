import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DeleteModalPayload {
  invoiceId: string;
  invoiceName: string;
}

interface UiState {
  sidebarCollapsed: boolean;
  deleteModal: {
    open: boolean;
    invoiceId: string | null;
    invoiceName: string | null;
  };
  toasts: Toast[];
}

const initialState: UiState = {
  sidebarCollapsed: false,
  deleteModal: {
    open: false,
    invoiceId: null,
    invoiceName: null,
  },
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    openDeleteModal(state, action: PayloadAction<DeleteModalPayload>) {
      state.deleteModal = {
        open: true,
        invoiceId: action.payload.invoiceId,
        invoiceName: action.payload.invoiceName,
      };
    },
    closeDeleteModal(state) {
      state.deleteModal = {
        open: false,
        invoiceId: null,
        invoiceName: null,
      };
    },
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({
        ...action.payload,
        id: crypto.randomUUID(),
      });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  openDeleteModal,
  closeDeleteModal,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
