import { NextResponse } from "next/server";
// FIX: Use the Prisma singleton instance to ensure a single connection pool and fix import errors.
import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const message = await prisma.message.findUnique({
      where: { id: params.id },
    });
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await prisma.message.delete({
      where: { id: params.id },
    });

    // Emit event to clients to remove the message from the UI
    getIO()?.emit("deleteMessage", { messageId: params.id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/messages/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
