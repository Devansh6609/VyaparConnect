// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import type { Order } from "../../../types";

// GET all orders for the logged-in user
export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get("contactId");

  try {
    const whereClause: any = { userId };
    if (contactId) {
      whereClause.contactId = contactId;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        contact: true,
        payments: true, // Include payments
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST to create a new order
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await req.json();
    const {
      contactId,
      customerName,
      contactNumber,
      billingAddress,
      shippingAddress,
      items,
      subtotal,
      total,
      discountPercentage,
      deliveryCharges,
      notes,
    } = body;

    if (
      !contactId ||
      !customerName ||
      !items ||
      items.length === 0 ||
      !billingAddress ||
      !shippingAddress
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // NOTE: Automatic stock decrement is disabled because item quantities can be strings (e.g., "250g"),
    // which makes it ambiguous how to decrement an integer-based stock level.
    // This would require a more complex inventory system with unit conversions.

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        contactNumber,
        billingAddress,
        shippingAddress,
        subtotal,
        total,
        discountPercentage,
        deliveryCharges,
        notes,
        status: "PENDING",
        contact: { connect: { id: contactId } },
        user: { connect: { id: userId } },
        items: {
          create: items.map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity.toString(), // Ensure quantity is a string
            price: item.price,
            // Connect to a product if an ID was provided, otherwise it's a manual entry
            ...(item.productId && {
              product: { connect: { id: item.productId } },
            }),
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        contact: true,
      },
    });

    await prisma.contact.update({
      where: { id: contactId },
      data: {
        lastBillingAddress: billingAddress,
        lastShippingAddress: shippingAddress,
        lastAddress: billingAddress, // for backward compatibility
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
