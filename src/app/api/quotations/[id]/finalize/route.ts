import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: quotationId } = await context.params;
  try {
    const body = await req.json();
    const { discountPercentage, taxRate, deliveryCharges, total } = body;

    if (total === undefined) {
      return NextResponse.json(
        { error: "Total amount is required" },
        { status: 400 }
      );
    }

    const updatedQuotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: {
        discountPercentage: parseFloat(discountPercentage) || 0,
        taxRate: parseFloat(taxRate) || 0,
        deliveryCharges: parseFloat(deliveryCharges) || 0,
        total: parseFloat(total),
        status: "BILLED",
      },
    });

    return NextResponse.json(updatedQuotation);
  } catch (error: any) {
    console.error(`Failed to finalize quotation ${quotationId}:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to finalize bill" },
      { status: 500 }
    );
  }
}
