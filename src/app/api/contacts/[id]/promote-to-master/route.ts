import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emitSocketEvent } from "@/lib/socket";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const contactId = params.id;
  try {
    const body = await req.json();
    const { name, shippingAddress, bankDetails, tagIds } = body;

    if (!name || !shippingAddress) {
      return NextResponse.json(
        { error: "Name and Shipping Address are required." },
        { status: 400 }
      );
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        isMasterCustomer: true,
        name,
        shippingAddress,
        bankDetails,
        tags: {
          // 'set' will replace all existing tags with the ones provided in the array
          set: Array.isArray(tagIds)
            ? tagIds.map((id: string) => ({ id }))
            : [],
        },
      },
      include: {
        tags: true,
      },
    });

    await emitSocketEvent("contact_updated", updatedContact);

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error(
      `Failed to promote or update master contact ${contactId}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to save customer details" },
      { status: 500 }
    );
  }
}
