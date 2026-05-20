import { createInvoice, fetchFilteredInvoices, fetchInvoicesPages } from '@/app/lib/data';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateInvoiceSchema = z.object({
  customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
});

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 1;

  try {
    const [invoices, totalPages] = await Promise.all([
      fetchFilteredInvoices(query, page),
      fetchInvoicesPages(query),
    ]);

    return NextResponse.json({ invoices, totalPages });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validatedFields = CreateInvoiceSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        details: validatedFields.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { customerId, amount, status } = validatedFields.data;

  try {
    await createInvoice({ customerId, amount, status });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create invoice.' }, { status: 500 });
  }
}
