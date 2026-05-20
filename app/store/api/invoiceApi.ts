import { CustomerField, InvoiceForm, InvoicesTable } from '@/app/lib/definitions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface GetFilteredInvoicesParams {
  query?: string;
  page?: number;
}

export interface GetFilteredInvoicesResponse {
  invoices: InvoicesTable[];
  totalPages: number;
}

export interface CreateInvoiceBody {
  customerId: string;
  amount: number;
  status: 'pending' | 'paid';
}

export interface UpdateInvoiceBody {
  customerId: string;
  amount: number;
  status: 'pending' | 'paid';
}

export interface MutationErrorResponse {
  error: string;
  details?: Record<string, string[]>;
}

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Invoice', 'InvoiceList', 'Customer'],
  keepUnusedDataFor: 60 * 5,
  endpoints: (builder) => ({
    getFilteredInvoices: builder.query<GetFilteredInvoicesResponse, GetFilteredInvoicesParams>({
      query: ({ query = '', page = 1 }) => ({
        url: '/invoices',
        params: { query, page },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.invoices.map(({ id }) => ({ type: 'Invoice' as const, id })),
              { type: 'InvoiceList' },
            ]
          : [{ type: 'InvoiceList' }],
    }),

    getInvoiceById: builder.query<InvoiceForm, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Invoice', id }],
    }),

    getCustomers: builder.query<CustomerField[], void>({
      query: () => '/customers',
      providesTags: ['Customer'],
    }),

    createInvoice: builder.mutation<{ success: boolean }, CreateInvoiceBody>({
      query: (body) => ({
        url: '/invoices',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'InvoiceList' }],
    }),

    updateInvoice: builder.mutation<{ success: boolean }, { id: string; body: UpdateInvoiceBody }>({
      query: ({ id, body }) => ({
        url: `/invoices/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Invoice', id },
        { type: 'InvoiceList' },
      ],
    }),

    deleteInvoice: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'InvoiceList' }],
    }),
  }),
});

export const {
  useGetFilteredInvoicesQuery,
  useGetInvoiceByIdQuery,
  useGetCustomersQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoiceApi;
