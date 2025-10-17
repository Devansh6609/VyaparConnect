// src/app/api/tags/route.ts
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
    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
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
    const { name, color } = await req.json();

    if (!name || !color) {
      return NextResponse.json(
        { error: "Name and color are required" },
        { status: 400 }
      );
    }

    const newTag = await prisma.tag.create({
      data: {
        name,
        color,
        userId,
      },
    });
    return NextResponse.json(newTag, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A tag with this name already exists for this user." },
        { status: 409 }
      );
    }
    console.error("POST /api/tags error:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
