// src/app/api/quotations/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

// GET all quotations (can be filtered by contactId)
export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
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

    const quotations = await prisma.quotation.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    });
    return NextResponse.json(quotations);
  } catch (error) {
    console.error("GET /api/quotations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}

// POST to create a new quotation
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
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
      status,
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

    const newQuotation = await prisma.quotation.create({
      data: {
        customerName,
        contactNumber,
        billingAddress,
        shippingAddress,
        subtotal,
        total: total || subtotal,
        status: status || "DRAFT",
        contact: { connect: { id: contactId } },
        user: { connect: { id: userId } },
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            price: item.price,
            productId: item.productId,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Update contact's last used addresses
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        lastBillingAddress: billingAddress,
        lastShippingAddress: shippingAddress,
        lastAddress: billingAddress, // for backward compatibility if needed
      },
    });

    return NextResponse.json(newQuotation, { status: 201 });
  } catch (error) {
    console.error("POST /api/quotations error:", error);
    return NextResponse.json(
      { error: "Failed to create quotation" },
      { status: 500 }
    );
  }
}
