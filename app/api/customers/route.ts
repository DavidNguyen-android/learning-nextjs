import { fetchCustomers } from '@/app/lib/data';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const customers = await fetchCustomers();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers.' }, { status: 500 });
  }
}
