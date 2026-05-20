'use client';

import { useCreateInvoiceMutation, useGetCustomersQuery } from '@/app/store/api/invoiceApi';
import { useAppDispatch } from '@/app/store/hooks';
import { addToast } from '@/app/store/slices/uiSlice';
import { Button } from '@/app/ui/button';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Form() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data: customers = [], isLoading: customersLoading } = useGetCustomersQuery();
    const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const customerId = formData.get('customerId') as string;
        const amount = Number(formData.get('amount'));
        const status = formData.get('status') as 'pending' | 'paid';

        if (!customerId) {
            setErrors({ customerId: ['Please select a customer.'] });
            return;
        }
        if (!amount || amount <= 0) {
            setErrors({ amount: ['Please enter an amount greater than $0.'] });
            return;
        }
        if (!status) {
            setErrors({ status: ['Please select an invoice status.'] });
            return;
        }

        try {
            await createInvoice({ customerId, amount, status }).unwrap();
            dispatch(addToast({ message: 'Invoice created successfully.', type: 'success' }));
            router.push('/dashboard/invoices');
        } catch (err: unknown) {
            const error = err as { data?: { details?: Record<string, string[]>; error?: string } };
            if (error?.data?.details) {
                setErrors(error.data.details);
            }
            setMessage(error?.data?.error || 'Failed to create invoice.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Choose customer
                    </label>
                    <div className="relative">
                        <select
                            id="customer"
                            name="customerId"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            disabled={customersLoading}
                            aria-describedby='customer-error'
                        >
                            <option value="" disabled>
                                {customersLoading ? 'Loading...' : 'Select a customer'}
                            </option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id='customer-error' aria-live='polite' aria-atomic='true'>
                        {
                            errors?.customerId &&
                            errors.customerId.map((error: string) => (
                                <p className='mt-2 text-sm text-red-500' key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                </div>

                {/* Invoice Amount */}
                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        Choose an amount
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                placeholder="Enter USD amount"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                required
                                aria-describedby='amount-error'
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        <div id='amount-error' aria-live='polite' aria-atomic='true'>
                            {
                                errors?.amount &&
                                errors.amount.map((error: string) => (
                                    <p className='mt-2 text-sm text-red-500' key={error}>
                                        {error}
                                    </p>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* Invoice Status */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        Set the invoice status
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4" aria-describedby='invoice-error'>
                            <div className="flex items-center" >
                                <input
                                    id="pending"
                                    name="status"
                                    type="radio"
                                    value="pending"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="pending"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                                >
                                    Pending <ClockIcon className="h-4 w-4" />
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="paid"
                                    name="status"
                                    type="radio"
                                    value="paid"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="paid"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                                >
                                    Paid <CheckIcon className="h-4 w-4" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div id='invoice-error' aria-live='polite' aria-atomic='true'>
                        {
                            errors?.status &&
                            errors.status.map((error: string) => (
                                <p className='mt-2 text-sm text-red-500' key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    <div id='form-error' aria-live='polite' aria-atomic='true'>
                        {
                            message
                                ? <p className='mt-2 text-sm text-red-500'>{message}</p>
                                : null
                        }
                    </div>
                </fieldset>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/invoices"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Invoice'}
                </Button>
            </div>
        </form>
    );
}
