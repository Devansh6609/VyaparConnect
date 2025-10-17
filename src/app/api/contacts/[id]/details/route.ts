// src/app/api/contacts/[id]/details/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = params.id;
    const contactDetails = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
        },
        quotations: {
          orderBy: { createdAt: "desc" },
        },
        tags: {
          orderBy: { name: "asc" },
        },
      },
    });

    if (!contactDetails) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contactDetails);
  } catch (error) {
    console.error(`Failed to fetch details for contact ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch contact details" },
      { status: 500 }
    );
  }
}
