// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
// FIX: Replaced Prisma enums with local types from `src/types.ts` due to import errors.
import type { OrderStatus, OrderPaymentStatus } from "@/types";

// Runtime values for validation, matching src/types.ts
const ALL_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];
const ALL_PAYMENT_STATUSES: OrderPaymentStatus[] = [
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
];

// GET a single order by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: session.user.id, // Ensure user can only access their own orders
      },
      include: {
        items: { include: { product: true }, orderBy: { id: "asc" } },
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error(`GET /api/orders/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// UPDATE an order (e.g., status change)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, paymentStatus } = body;

    const dataToUpdate: {
      status?: OrderStatus;
      paymentStatus?: OrderPaymentStatus;
    } = {};
    if (status && ALL_ORDER_STATUSES.includes(status)) {
      dataToUpdate.status = status;
    }
    if (paymentStatus && ALL_PAYMENT_STATUSES.includes(paymentStatus)) {
      dataToUpdate.paymentStatus = paymentStatus;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(`PUT /api/orders/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE an order (and restock items)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const orderToDelete = await prisma.order.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!orderToDelete) {
      throw new Error("Order not found or access denied.");
    }

    // Just delete the order. Stock management is manual now.
    await prisma.order.delete({ where: { id: params.id } });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error: any) {
    console.error(`DELETE /api/orders/${params.id} error:`, error);
    if (error.message.includes("Order not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
