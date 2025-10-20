// src/app/api/quotations/[id]/create-payment-link/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// REMOVED: import Razorpay from "razorpay";

// The constants and initialization need to move inside POST
// const keyId = process.env.RAZORPAY_KEY_ID || "";
// const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
// const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret, });

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Dynamic import of Razorpay inside the server function
  const { default: Razorpay } = await import("razorpay");

  const keyId = process.env.RAZORPAY_KEY_ID || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay keys are not configured in environment variables." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const { id: quotationId } = await context.params;
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(quotation.total * 100), // Amount in paise
      currency: "INR",
      description: `Payment for Quotation #${quotation.id}`,
      customer: {
        name: quotation.customerName,
        contact: quotation.contactNumber,
      },
      notify: { sms: true, email: false },
      reminder_enable: true,
      notes: {
        quotation_id: quotation.id,
      },
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      callback_method: "get",
    });

    // Optional: save the payment link ID to the quotation
    await prisma.quotation.update({
      where: { id: quotationId },
      data: {
        paymentLinkId: paymentLink.id,
        paymentLinkUrl: paymentLink.short_url,
      },
    });

    return NextResponse.json({
      success: true,
      paymentLinkUrl: paymentLink.short_url,
    });
  } catch (error: any) {
    console.error("Failed to create Razorpay payment link:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment link" },
      { status: 500 }
    );
  }
}
