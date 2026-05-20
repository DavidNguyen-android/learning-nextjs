import InvoicesPageClient from "@/app/ui/invoices/invoices-page-client";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Invoices',
};

export default function Page() {
    return <InvoicesPageClient />;
}