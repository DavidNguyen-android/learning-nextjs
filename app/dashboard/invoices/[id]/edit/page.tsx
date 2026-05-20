'use client';

import { useGetCustomersQuery, useGetInvoiceByIdQuery } from '@/app/store/api/invoiceApi';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import EditInvoiceForm from '@/app/ui/invoices/edit-form';
import { notFound, useParams } from 'next/navigation';

export default function Page() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { data: invoice, isLoading: invoiceLoading, error: invoiceError } = useGetInvoiceByIdQuery(id);
    const { data: customers = [], isLoading: customersLoading } = useGetCustomersQuery();

    if (invoiceLoading || customersLoading) {
        return (
            <main>
                <div className="animate-pulse">
                    <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
                    <div className="h-96 bg-gray-200 rounded" />
                </div>
            </main>
        );
    }

    if (invoiceError || !invoice) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs breadcrumbs={
                [
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    }
                ]
            } />
            <EditInvoiceForm customers={customers} invoice={invoice} />
        </main>
    );
}