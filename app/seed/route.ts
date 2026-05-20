import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { customers, invoices, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers(tx: postgres.Sql) {
  await tx`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await tx`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const hashedPasswords = await Promise.all(
    users.map((user) => bcrypt.hash(user.password, 10)),
  );

  const values = users.map((user, i) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    password: hashedPasswords[i],
  }));

  await tx`
    INSERT INTO users ${tx(values, 'id', 'name', 'email', 'password')}
    ON CONFLICT (id) DO NOTHING
  `;
}

async function seedCustomers(tx: postgres.Sql) {
  await tx`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await tx`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`;

  await tx`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const values = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    image_url: c.image_url,
  }));

  await tx`
    INSERT INTO customers ${tx(values, 'id', 'name', 'email', 'image_url')}
    ON CONFLICT (id) DO NOTHING
  `;

  // Indexes for customers
  await tx`CREATE INDEX IF NOT EXISTS idx_customers_name ON customers (name ASC)`;
  await tx`CREATE INDEX IF NOT EXISTS idx_customers_name_trgm ON customers USING gin (name gin_trgm_ops)`;
  await tx`CREATE INDEX IF NOT EXISTS idx_customers_email_trgm ON customers USING gin (email gin_trgm_ops)`;
}

async function seedInvoices(tx: postgres.Sql) {
  await tx`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES customers(id),
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const values = invoices.map((inv) => ({
    customer_id: inv.customer_id,
    amount: inv.amount,
    status: inv.status,
    date: inv.date,
  }));

  await tx`
    INSERT INTO invoices ${tx(values, 'customer_id', 'amount', 'status', 'date')}
    ON CONFLICT (id) DO NOTHING
  `;

  // Indexes for invoices
  await tx`CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices (customer_id)`;
  await tx`CREATE INDEX IF NOT EXISTS idx_invoices_date_desc ON invoices (date DESC)`;
  await tx`CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (status)`;
  await tx`CREATE INDEX IF NOT EXISTS idx_invoices_customer_date ON invoices (customer_id, date DESC)`;
}

async function seedRevenue(tx: postgres.Sql) {
  await tx`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const values = revenue.map((rev) => ({
    month: rev.month,
    revenue: rev.revenue,
  }));

  await tx`
    INSERT INTO revenue ${tx(values, 'month', 'revenue')}
    ON CONFLICT (month) DO NOTHING
  `;
}

export async function GET() {
  try {
    // Check if tables already have data
    const [{ exists }] = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables WHERE table_name = 'users'
      )
    `;

    if (exists) {
      const [{ count }] = await sql`SELECT COUNT(*) FROM users`;
      if (Number(count) > 0) {
        return Response.json({ message: 'Database already seeded.' }, { status: 200 });
      }
    }

    await sql.begin(async (tx) => {
      await seedUsers(tx);
      await seedCustomers(tx);
      await seedInvoices(tx);
      await seedRevenue(tx);
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
