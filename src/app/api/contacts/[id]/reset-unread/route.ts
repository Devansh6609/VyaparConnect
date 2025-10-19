import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emitSocketEvent } from "@/lib/socket";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    if (!id) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.findUnique({ where: { id } });

    if (contact && contact.unreadCount > 0) {
      await prisma.contact.update({
        where: { id },
        data: { unreadCount: 0 },
      });

      // Emit socket event to notify clients (like the dashboard)
      await emitSocketEvent("contact-read", { contactId: id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`reset-unread error for contact ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to reset unread count" },
      { status: 500 }
    );
  }
}
