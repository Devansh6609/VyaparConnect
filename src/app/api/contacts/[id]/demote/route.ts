import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emitSocketEvent } from "@/lib/socket-server";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const contactId = params.id;
  try {
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        isMasterCustomer: false,
      },
    });

    await emitSocketEvent("contact_updated", updatedContact);

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error(`Failed to demote contact ${contactId}:`, error);
    return NextResponse.json(
      { error: "Failed to demote customer" },
      { status: 500 }
    );
  }
}
