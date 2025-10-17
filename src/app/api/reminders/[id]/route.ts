// src/app/api/reminders/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// UPDATE a reminder (e.g., mark as complete)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const reminderId = params.id;
  try {
    const body = await req.json();
    const { status } = body; // expecting { status: 'COMPLETED' }

    if (!status || (status !== "PENDING" && status !== "COMPLETED")) {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 }
      );
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: { status },
    });

    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error(`Failed to update reminder ${reminderId}:`, error);
    return NextResponse.json(
      { error: "Failed to update reminder" },
      { status: 500 }
    );
  }
}

// DELETE a reminder
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const reminderId = params.id;
  try {
    await prisma.reminder.delete({
      where: { id: reminderId },
    });
    return NextResponse.json({ success: true, message: "Reminder deleted" });
  } catch (error) {
    console.error(`Failed to delete reminder ${reminderId}:`, error);
    return NextResponse.json(
      { error: "Failed to delete reminder" },
      { status: 500 }
    );
  }
}
