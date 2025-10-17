import { NextResponse } from "next/server";
// FIX: Use the Prisma singleton instance to ensure a single connection pool.
import prisma from "@/lib/prisma";

// GET /api/contacts/[id]/notes -> fetch all notes for a contact
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const contactId = params.id;
  try {
    const notes = await prisma.note.findMany({
      where: { contactId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error(`Failed to fetch notes for contact ${contactId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST /api/contacts/[id]/notes -> create a new note for a contact
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const contactId = params.id;
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Note content cannot be empty" },
        { status: 400 }
      );
    }

    const newNote = await prisma.note.create({
      data: {
        content,
        contactId,
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error(`Failed to create note for contact ${contactId}:`, error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
