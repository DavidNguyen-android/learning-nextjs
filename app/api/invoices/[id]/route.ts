import { deleteInvoice, fetchInvoiceById, updateInvoice } from '@/app/lib/data';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateInvoiceSchema = z.object({
  customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const invoice = await fetchInvoiceById(id);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
    }
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const validatedFields = UpdateInvoiceSchema.safeParse(body);

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
    await updateInvoice(id, { customerId, amount, status });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update invoice.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteInvoice(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete invoice.' }, { status: 500 });
  }
}
