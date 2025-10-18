// src/app/api/contacts/[id]/reminders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth"; // <-- NEW IMPORT

// GET all reminders for a contact
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const contactId = params.id;
  try {
    const reminders = await prisma.reminder.findMany({
      where: { contactId },
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
  const session = await getAuthSession(); // <-- GET AUTH SESSION
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id; // <-- GET USER ID

  const contactId = params.id;
  try {
    const { remindAt, ownerMessage, customerMessage } = await req.json();

    if (!remindAt || !ownerMessage) {
      return NextResponse.json(
        { error: "Reminder date and owner message are required" },
        { status: 400 }
      );
    }

    // Optional: Validate that the contact belongs to the user
    const contact = await prisma.contact.findUnique({
      where: { id: contactId, userId },
    });
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const newReminder = await prisma.reminder.create({
      data: {
        contactId,
        remindAt: new Date(remindAt),
        ownerMessage,
        customerMessage,
        userId, // <-- THE CRITICAL FIX: Add the required userId
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
