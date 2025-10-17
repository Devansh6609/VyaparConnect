import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a single quotation
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: true } },
        payments: true,
      },
    });
    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(quotation);
  } catch (error) {
    console.error(`GET /api/quotations/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch quotation" },
      { status: 500 }
    );
  }
}

// UPDATE a quotation (general purpose, e.g., for editing items before finalizing)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { customerName, contactNumber, address, items, subtotal, total } =
      body;

    const updatedQuotation = await prisma.quotation.update({
      where: { id: params.id },
      data: {
        customerName,
        contactNumber,
        address,
        subtotal,
        total,
      },
    });

    return NextResponse.json(updatedQuotation);
  } catch (error) {
    console.error(`PUT /api/quotations/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}

// DELETE a quotation
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.quotation.delete({
      where: { id: params.id },
    });
    return NextResponse.json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    console.error(`DELETE /api/quotations/${params.id} error:`, error);
    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 }
    );
  }
}
