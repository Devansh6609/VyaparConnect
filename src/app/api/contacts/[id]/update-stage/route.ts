// src/app/api/contacts/[id]/update-stage/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const contactId = params.id;
    try {
        const { stage } = await req.json();

        if (!stage) {
            return NextResponse.json({ error: 'Stage is required' }, { status: 400 });
        }

        const updatedContact = await prisma.contact.update({
            where: { id: contactId },
            data: { stage },
        });

        return NextResponse.json(updatedContact, { status: 200 });

    } catch (error) {
        console.error(`Failed to update stage for contact ${contactId}:`, error);
        return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 });
    }
}
