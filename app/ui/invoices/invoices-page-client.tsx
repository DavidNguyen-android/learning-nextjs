'use client';

import { useGetFilteredInvoicesQuery } from '@/app/store/api/invoiceApi';
import { lusitana } from '@/app/ui/fonts';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import Pagination from '@/app/ui/invoices/pagination';
import InvoicesTable from '@/app/ui/invoices/table';
import Search from '@/app/ui/search';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { useSearchParams } from 'next/navigation';

export default function InvoicesPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, isFetching } = useGetFilteredInvoicesQuery({
    query,
    page: currentPage,
  });

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      {isLoading ? (
        <InvoicesTableSkeleton />
      ) : (
        <div className={isFetching ? 'opacity-60 transition-opacity' : ''}>
          <InvoicesTable invoices={data?.invoices ?? []} />
        </div>
      )}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={data?.totalPages ?? 0} />
      </div>
    </div>
  );
}
