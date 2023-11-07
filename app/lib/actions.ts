'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';

const InvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.date()
});

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });

export const createInvoice = async (formDate: FormData) => {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formDate.get('customerId'),
        amount: formDate.get('amount'),
        status: formDate.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
};



