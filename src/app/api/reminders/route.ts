// src/app/api/contacts/[id]/reminders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
  const contactId = params.id;
  try {
    const { remindAt, ownerMessage, customerMessage } = await req.json();

    if (!remindAt || !ownerMessage) {
      return NextResponse.json(
        { error: "Reminder date and owner message are required" },
        { status: 400 }
      );
    }

    const newReminder = await prisma.reminder.create({
      data: {
        contactId,
        remindAt: new Date(remindAt),
        ownerMessage,
        customerMessage,
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
