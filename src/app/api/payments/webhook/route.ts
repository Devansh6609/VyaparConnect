// src/app/api/payments/webhook/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendWhatsAppMessage, WhatsAppCredentials } from "@/lib/whatsapp";
import { emitSocketEvent } from "@/lib/socket";

async function saveAndEmitMessage(messageData: any) {
  const savedMessage = await prisma.message.create({
    data: messageData,
    include: { contact: true },
  });
  await emitSocketEvent("newMessage", savedMessage);
  return savedMessage;
}

async function getCredsForUser(
  userId: string
): Promise<WhatsAppCredentials | null> {
  const settings = await prisma.settings.findUnique({ where: { userId } });
  if (settings?.whatsappAccessToken && settings.whatsappPhoneNumberId) {
    return {
      token: settings.whatsappAccessToken,
      phoneId: settings.whatsappPhoneNumberId,
    };
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.warn("Webhook received without signature.");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    if (expected !== signature) {
      console.error("Webhook received with invalid signature.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment_link.paid") {
      const paymentLink = event.payload.payment_link.entity;
      const notes = paymentLink.notes;
      const paymentAmount = paymentLink.amount / 100;
      const razorpayPaymentId = event.payload.payment.entity.id;

      // --- Handle Quotation Payment ---
      if (notes?.quotation_id) {
        const quotation = await prisma.quotation.findUnique({
          where: { id: notes.quotation_id },
          include: { contact: true },
        });
        if (!quotation) {
          console.log(`Webhook: Quotation ID ${notes.quotation_id} not found.`);
          return NextResponse.json({
            success: true,
            message: "Quotation not found.",
          });
        }

        await prisma.payment.create({
          data: {
            quotationId: quotation.id,
            amount: paymentAmount,
            status: "PAID",
            method: "razorpay",
            razorpayPaymentId,
          },
        });
        const allPayments = await prisma.payment.findMany({
          where: { quotationId: quotation.id, status: "PAID" },
        });
        const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
        const newStatus =
          totalPaid >= quotation.total ? "PAID" : "PARTIALLY_PAID";

        const updatedQuotation = await prisma.quotation.update({
          where: { id: quotation.id },
          data: { status: newStatus },
          include: { payments: true },
        });

        const creds = await getCredsForUser(quotation.userId);
        if (creds) {
          const confirmationText = `✅ Payment Received! We have received your payment of ₹${paymentAmount.toLocaleString(
            "en-IN"
          )} for Quotation #${quotation.id.substring(0, 6)}. Thank you!`;
          const waResponse = await sendWhatsAppMessage(
            quotation.contact.phone,
            confirmationText,
            creds
          );
          const wamid = waResponse?.messages?.[0]?.id;
          await saveAndEmitMessage({
            from: "business",
            to: quotation.contact.phone,
            type: "text",
            text: confirmationText,
            contactId: quotation.contact.id,
            wamid,
            status: wamid ? "sent" : "failed",
          });
        }
        await emitSocketEvent("quotation_update", updatedQuotation);
      }

      // --- Handle Order Payment ---
      else if (notes?.order_id) {
        const order = await prisma.order.findUnique({
          where: { id: notes.order_id },
          include: { contact: true },
        });
        if (!order) {
          console.log(`Webhook: Order ID ${notes.order_id} not found.`);
          return NextResponse.json({
            success: true,
            message: "Order not found.",
          });
        }

        await prisma.payment.create({
          data: {
            orderId: order.id,
            amount: paymentAmount,
            status: "PAID",
            method: "razorpay",
            razorpayPaymentId,
          },
        });
        const allPayments = await prisma.payment.findMany({
          where: { orderId: order.id, status: "PAID" },
        });
        const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
        const newPaymentStatus =
          totalPaid >= order.total ? "PAID" : "PARTIALLY_PAID";

        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: newPaymentStatus },
          include: { payments: true, items: true, contact: true },
        });

        const creds = await getCredsForUser(order.userId);
        if (creds) {
          const confirmationText = `✅ Payment Received! We have received your payment of ₹${paymentAmount.toLocaleString(
            "en-IN"
          )} for Order #${order.id.substring(0, 6)}. Thank you!`;
          const waResponse = await sendWhatsAppMessage(
            order.contact.phone,
            confirmationText,
            creds
          );
          const wamid = waResponse?.messages?.[0]?.id;
          await saveAndEmitMessage({
            from: "business",
            to: order.contact.phone,
            type: "text",
            text: confirmationText,
            contactId: order.contact.id,
            wamid,
            status: wamid ? "sent" : "failed",
          });
        }
        await emitSocketEvent("order_update", updatedOrder);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Razorpay webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
