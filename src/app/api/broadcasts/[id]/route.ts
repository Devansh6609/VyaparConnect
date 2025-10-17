// src/app/api/broadcasts/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const broadcast = await prisma.broadcast.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: {
        recipients: {
          include: { contact: true },
          orderBy: { contact: { name: "asc" } },
        },
      },
    });
    if (!broadcast) {
      return NextResponse.json(
        { error: "Broadcast not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(broadcast);
  } catch (error) {
    console.error(`GET /api/broadcasts/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch broadcast details" },
      { status: 500 }
    );
  }
}
