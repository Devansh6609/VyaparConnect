// src/app/api/transactions/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
// FIX: Used type-only import with path alias to prevent module resolution errors.
import type { Transaction } from "../../../types";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const quotations = await prisma.quotation.findMany({
      where: { userId: userId }, // Ensures only user's own data is fetched
      orderBy: { createdAt: "desc" },
      include: {
        contact: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const transactions: Transaction[] = quotations.map((q) => ({
      id: q.id,
      customerName: q.customerName,
      date: q.createdAt.toISOString(),
      totalValue: q.total,
      status: q.status,
      contactId: q.contactId,
      itemsSummary:
        q.items.length > 1
          ? `${q.items[0].product?.name || "Item"} & ${q.items.length - 1} more`
          : q.items[0]?.product?.name || "Item not specified",
      itemCount: q.items.length,
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
