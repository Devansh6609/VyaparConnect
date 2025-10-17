// src/app/api/contacts/[id]/tags/[tagId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; tagId: string } }
) {
  try {
    const { id: contactId, tagId } = params;

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        tags: {
          disconnect: { id: tagId },
        },
      },
      include: { tags: true },
    });

    return NextResponse.json(updatedContact);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Contact or Tag not found" },
        { status: 404 }
      );
    }
    console.error(
      `DELETE /api/contacts/${params.id}/tags/${params.tagId} error:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to remove tag from contact" },
      { status: 500 }
    );
  }
}
