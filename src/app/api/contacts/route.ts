// src/app/api/contacts/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const cursor = searchParams.get("cursor") || undefined;
    const tagIdsParam = searchParams.get("tags");
    const tagIds = tagIdsParam ? tagIdsParam.split(",") : [];

    const whereClause: any = {
      userId: userId, // Filter by the logged-in user
    };

    if (tagIds.length > 0) {
      whereClause.tags = {
        some: {
          id: { in: tagIds },
        },
      };
    }

    const contacts = await prisma.contact.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        tags: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const result = contacts.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      isMasterCustomer: c.isMasterCustomer,
      lastMessage:
        c.messages[0]?.text ||
        (c.messages[0] ? `Sent a ${c.messages[0].type}` : ""),
      lastMessageAt: c.messages[0]?.createdAt || c.updatedAt,
      avatarUrl: c.avatarUrl || null,
      unreadCount: c.unreadCount || 0,
      tags: c.tags,
    }));

    let nextCursor: typeof cursor | null = null;
    if (contacts.length === limit) {
      nextCursor = contacts[contacts.length - 1].id;
    }

    return NextResponse.json({ contacts: result, nextCursor });
  } catch (err) {
    console.error("GET /api/contacts error", err);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
