import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/create-form";

export default function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Invoices", href: "/dashboard/invoices" },
                    {
                        label: "Create Invoice",
                        href: "/dashboard/invoices/create",
                        active: true,
                    }
                ]} />
            <Form />
        </main>
    );
}