// src/app/api/groups/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const groups = await prisma.group.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const result = groups.map((g) => ({
      id: g.id,
      name: g.name,
      whatsappGroupId: g.whatsappGroupId,
      lastMessage: g.messages[0]?.text || ``,
      lastMessageAt: g.messages[0]?.createdAt || g.updatedAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/groups error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const { name, whatsappGroupId } = await req.json();

    if (!name || !whatsappGroupId) {
      return NextResponse.json(
        { error: "Group name and WhatsApp Group ID are required" },
        { status: 400 }
      );
    }

    const existingGroup = await prisma.group.findFirst({
      where: { whatsappGroupId, userId },
    });
    if (existingGroup) {
      return NextResponse.json(
        { error: "This WhatsApp Group ID is already registered." },
        { status: 409 }
      );
    }

    const group = await prisma.group.create({
      data: {
        name,
        whatsappGroupId,
        userId,
      },
    });
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error("POST /api/groups error:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
