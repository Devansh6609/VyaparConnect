// src/app/api/orders/items/[itemId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
// FIX: Replaced Prisma enum with local type from `src/types.ts` due to import errors.
import type { OrderItemStatus } from "../../../../../types";

const ALL_ITEM_STATUSES: OrderItemStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// The params type is widened to handle potential casing issues from file systems/frameworks
export async function PUT(
  req: Request,
  { params }: { params: { itemId?: string; itemid?: string } }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Handle both `itemId` and `itemid` from params due to build/filesystem casing differences
    const itemId = params.itemId || params.itemid;
    const { status } = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID missing from URL parameters." },
        { status: 400 }
      );
    }

    if (!status || !ALL_ITEM_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 }
      );
    }

    // Authorization check: Ensure the item belongs to an order owned by the user
    const item = await prisma.orderItem.findUnique({
      where: { id: itemId },
      select: { order: { select: { userId: true } } },
    });

    if (!item || item.order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Order item not found or access denied." },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    const itemId = params.itemId || params.itemid;
    console.error(`PUT /api/orders/items/${itemId} error:`, error);
    return NextResponse.json(
      { error: "Failed to update order item" },
      { status: 500 }
    );
  }
}
