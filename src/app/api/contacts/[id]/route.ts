// src/app/api/contacts/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a single contact
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const contact = await prisma.contact.findUnique({
            where: { id: params.id },
        });
        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }
        return NextResponse.json(contact);
    } catch (error) {
        console.error('GET /api/contacts/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
    }
}

// UPDATE a contact
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { name, phone, avatarUrl } = body;

        const updatedContact = await prisma.contact.update({
            where: { id: params.id },
            data: {
                name,
                phone,
                avatarUrl,
            },
        });

        return NextResponse.json(updatedContact);

    } catch (error) {
        console.error('PUT /api/contacts/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }
}

// DELETE a contact
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.contact.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/contacts/[id] error:', error);
        // Handle specific Prisma error for not found
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
