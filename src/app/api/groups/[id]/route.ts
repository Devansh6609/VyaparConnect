// src/app/api/groups/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: params.id },
    });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    return NextResponse.json(group);
  } catch (error) {
    console.error(`GET /api/groups/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    const updatedGroup = await prisma.group.update({
      where: { id: params.id },
      data: { name },
    });
    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error(`PUT /api/groups/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // We must also delete related messages to avoid foreign key constraint errors
    await prisma.$transaction([
      prisma.message.deleteMany({ where: { groupId: params.id } }),
      prisma.group.delete({ where: { id: params.id } }),
    ]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`DELETE /api/groups/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
