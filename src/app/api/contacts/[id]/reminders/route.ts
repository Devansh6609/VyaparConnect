// src/app/api/contacts/[id]/reminders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

// GET all reminders for a contact
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const contactId = params.id;
  try {
    const reminders = await prisma.reminder.findMany({
      where: { contactId, userId: session.user.id },
      orderBy: { remindAt: "asc" },
    });
    return NextResponse.json(reminders);
  } catch (error) {
    console.error(`Failed to fetch reminders for contact ${contactId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
}

// POST a new reminder for a contact
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;
  const contactId = params.id;

  // Authorization check
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, userId },
  });
  if (!contact) {
    return NextResponse.json(
      { error: "Contact not found or access denied" },
      { status: 404 }
    );
  }

  try {
    const { remindAt, ownerMessage, customerMessage, quotationId } =
      await req.json();

    if (!remindAt || !ownerMessage) {
      return NextResponse.json(
        { error: "Reminder date and owner message are required" },
        { status: 400 }
      );
    }

    const newReminder = await prisma.reminder.create({
      data: {
        contactId,
        userId,
        remindAt: new Date(remindAt),
        ownerMessage,
        customerMessage,
        quotationId, // Link to the quotation
      },
    });

    return NextResponse.json(newReminder, { status: 201 });
  } catch (error) {
    console.error(`Failed to create reminder for contact ${contactId}:`, error);
    return NextResponse.json(
      { error: "Failed to create reminder" },
      { status: 500 }
    );
  }
}
