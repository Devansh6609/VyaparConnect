// src/app/api/quotations/[id]/status/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: quotationId } = await context.params;
  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const updatedQuotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: { status },
    });

    return NextResponse.json(updatedQuotation);
  } catch (error) {
    console.error(
      `Failed to update status for quotation ${quotationId}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to update quotation status" },
      { status: 500 }
    );
  }
}
