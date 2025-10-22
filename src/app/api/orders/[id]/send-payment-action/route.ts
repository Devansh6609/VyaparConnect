// src/app/api/orders/[id]/send-payment-action/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emitSocketEvent } from "@/lib/socket-server";
import {
  sendWhatsAppImageMessage,
  sendWhatsAppMessage,
  WhatsAppCredentials,
} from "@/lib/whatsapp";
import Razorpay from "razorpay";
import nodeHtmlToImage from "node-html-to-image";
import { Buffer } from "node:buffer";
import type { Order } from "../../../../../types";
import { getAuthSession } from "@/lib/auth";

interface Settings {
  companyName?: string | null;
  companyAddress?: string | null;
  companyLogoUrl?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankIfscCode?: string | null;
  upiQrCodeUrl?: string | null;
  razorpayKeyId?: string | null;
  razorpayKeySecret?: string | null;
  whatsappAccessToken?: string | null;
  whatsappPhoneNumberId?: string | null;
}

type OrderWithDetails = Order;

// --- HTML Template Helper ---
function getBillHtml(
  order: OrderWithDetails,
  settings: Settings | null
): string {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * Number(item.quantity || 1),
    0
  );
  const discountAmount = (subtotal * (order.discountPercentage || 0)) / 100;

  return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; width: 600px; background-color: #f9f9f9; color: #333; }
            .container { border: 1px solid #eee; background-color: white; padding: 30px; border-radius: 8px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
            .company-details { font-size: 12px; color: #555; }
            .bill-details { text-align: right; font-size: 12px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            .table th { background-color: #f7fafc; font-weight: bold; }
            .totals { float: right; width: 50%; margin-top: 20px; font-size: 14px; }
            .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                ${
                  settings?.companyLogoUrl
                    ? `<img src="${settings.companyLogoUrl}" alt="logo" style="max-width: 150px; margin-bottom: 10px;"/>`
                    : ""
                }
                <div class="company-details">
                  <strong>${
                    settings?.companyName || "Your Company"
                  }</strong><br/>
                  ${settings?.companyAddress?.replace(/\n/g, "<br/>") || ""}
                </div>
              </div>
              <div class="bill-details">
                <h2>INVOICE</h2>
                <strong>Bill to:</strong> ${order.customerName}<br/>
                <strong>Order ID:</strong> #${order.id.substring(0, 6)}<br/>
                <strong>Date:</strong> ${new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </div>
            </div>
            <table class="table">
              <thead><tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th></tr></thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.productName}</td>
                    <td style="text-align:center;">${item.quantity}</td>
                    <td style="text-align:right;">₹${item.price.toFixed(2)}</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="totals">
              <div><span>Subtotal</span><span>₹${subtotal.toFixed(
                2
              )}</span></div>
              ${
                order.discountPercentage
                  ? `<div><span>Discount (${
                      order.discountPercentage
                    }%)</span><span>- ₹${discountAmount.toFixed(
                      2
                    )}</span></div>`
                  : ""
              }
              ${
                order.deliveryCharges
                  ? `<div><span>Delivery</span><span>+ ₹${order.deliveryCharges.toFixed(
                      2
                    )}</span></div>`
                  : ""
              }
              <div class="grand-total"><span>Grand Total</span><span>₹${order.total.toFixed(
                2
              )}</span></div>
            </div>
          </div>
        </body>
      </html>`;
}

async function createAndSendMessage(messageData: any, sendFunction: Function) {
  const savedMessage = await prisma.message.create({
    data: { ...messageData, status: "pending" },
    include: { contact: true },
  });
  await emitSocketEvent("newMessage", savedMessage);

  const waResponse = await sendFunction();
  const wamid = waResponse?.messages?.[0]?.id;
  const finalStatus = wamid ? "sent" : "failed";

  const updatedMessage = await prisma.message.update({
    where: { id: savedMessage.id },
    data: { wamid: wamid, status: finalStatus },
  });
  await emitSocketEvent("message-status-update", {
    id: updatedMessage.id,
    status: finalStatus,
    wamid: wamid,
  });

  if (!wamid) {
    throw new Error("Failed to send message via WhatsApp.");
  }
}

async function handleAction(
  action: string,
  order: OrderWithDetails,
  settings: Settings | null,
  creds: WhatsAppCredentials,
  amount?: number
) {
  const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
  const amountDue = order.total - totalPaid;

  switch (action) {
    case "send_bill_image": {
      const html = getBillHtml(order, settings);
      const buffer = (await nodeHtmlToImage({
        html,
        puppeteerArgs: { args: ["--no-sandbox"] },
      })) as Buffer;
      const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!imgbbApiKey)
        throw new Error(
          "Server configuration error: ImgBB API key is not set."
        );
      const formData = new FormData();
      formData.append("image", buffer.toString("base64"));
      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        { method: "POST", body: formData }
      );
      const imgbbData = await imgbbRes.json();
      if (!imgbbRes.ok) throw new Error("Failed to upload bill image.");

      const publicImageUrl = imgbbData.data.url;
      const caption = `Hi ${order.customerName}, please find your order bill attached.`;
      await createAndSendMessage(
        {
          from: "business",
          to: order.contact.phone,
          type: "image",
          text: caption,
          mediaUrl: publicImageUrl,
          contactId: order.contact.id,
        },
        () =>
          sendWhatsAppImageMessage(
            order.contact.phone,
            publicImageUrl,
            caption,
            creds
          )
      );
      break;
    }

    case "send_razorpay": {
      if (!settings?.razorpayKeyId || !settings?.razorpayKeySecret)
        throw new Error("Razorpay API keys are not configured.");
      if (amountDue <= 0) throw new Error("The bill is already paid in full.");
      const razorpay = new Razorpay({
        key_id: settings.razorpayKeyId,
        key_secret: settings.razorpayKeySecret,
      });
      const paymentLink = await razorpay.paymentLink.create({
        amount: Math.round(amountDue * 100),
        currency: "INR",
        description: `Payment for Order #${order.id.substring(0, 6)}`,
        customer: {
          name: order.customerName,
          contact: order.contactNumber.replace("+", ""),
        },
        notify: { sms: true, email: false },
        reminder_enable: true,
        notes: { order_id: order.id },
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders`,
        callback_method: "get",
      });

      // Generate QR Code from payment link
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        paymentLink.short_url
      )}`;
      const qrCodeRes = await fetch(qrCodeApiUrl);
      if (!qrCodeRes.ok) throw new Error("Failed to generate QR code image.");
      const qrCodeBlob = await qrCodeRes.blob();

      // Upload QR Code to get a public URL
      const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!imgbbApiKey)
        throw new Error(
          "Server configuration error: ImgBB API key is not set."
        );
      const formData = new FormData();
      formData.append("image", qrCodeBlob, "razorpay-qr.png");
      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        { method: "POST", body: formData }
      );
      const imgbbData = await imgbbRes.json();
      if (!imgbbRes.ok || !imgbbData.data?.url) {
        console.error("ImgBB upload failed for QR code:", imgbbData);
        throw new Error("Failed to upload QR code image.");
      }
      const publicQrUrl = imgbbData.data.url;

      // Send image with caption
      const caption = `Thank you for your order! Amount due: *₹${amountDue.toFixed(
        2
      )}*. \n\nPlease scan the QR code to pay or click the link below:\n${
        paymentLink.short_url
      }`;
      await createAndSendMessage(
        {
          from: "business",
          to: order.contact.phone,
          type: "image",
          text: caption,
          mediaUrl: publicQrUrl,
          contactId: order.contact.id,
        },
        () =>
          sendWhatsAppImageMessage(
            order.contact.phone,
            publicQrUrl,
            caption,
            creds
          )
      );
      break;
    }

    case "send_bank_details": {
      const bankDetailsText =
        settings?.bankName &&
        settings?.bankAccountNumber &&
        settings?.bankIfscCode
          ? `Bank Name: ${settings.bankName}\nAccount No: ${settings.bankAccountNumber}\nIFSC Code: ${settings.bankIfscCode}`
          : null;
      if (!bankDetailsText)
        throw new Error("Bank details are not fully configured in settings.");
      if (amountDue <= 0) throw new Error("The bill is already paid in full.");
      const messageText = `A friendly reminder for your payment. The amount due is *₹${amountDue.toFixed(
        2
      )}*. \n\nYou can pay via bank transfer to:\n\n${bankDetailsText}`;
      await createAndSendMessage(
        {
          from: "business",
          to: order.contact.phone,
          type: "text",
          text: messageText,
          contactId: order.contact.id,
        },
        () => sendWhatsAppMessage(order.contact.phone, messageText, creds)
      );
      break;
    }

    case "send_qr_code": {
      if (!settings?.upiQrCodeUrl)
        throw new Error("UPI QR Code URL is not configured in settings.");
      if (amountDue <= 0) throw new Error("The bill is already paid in full.");
      const caption = `Please scan this QR code to pay the remaining balance of *₹${amountDue.toFixed(
        2
      )}*.`;
      await createAndSendMessage(
        {
          from: "business",
          to: order.contact.phone,
          type: "image",
          text: caption,
          mediaUrl: settings.upiQrCodeUrl,
          contactId: order.contact.id,
        },
        () =>
          sendWhatsAppImageMessage(
            order.contact.phone,
            settings!.upiQrCodeUrl!,
            caption,
            creds
          )
      );
      break;
    }

    default:
      throw new Error("Invalid action specified.");
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id: orderId } = await context.params;
  try {
    const { action, amount } = await req.json();

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: { contact: true, items: true, payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const settings = await prisma.settings.findUnique({
      where: { userId: order.userId },
    });
    const creds: WhatsAppCredentials | null =
      settings?.whatsappAccessToken && settings?.whatsappPhoneNumberId
        ? {
            token: settings.whatsappAccessToken,
            phoneId: settings.whatsappPhoneNumberId,
          }
        : null;
    if (!creds) throw new Error("WhatsApp API credentials are not configured.");

    await handleAction(
      action,
      order as unknown as OrderWithDetails,
      settings,
      creds,
      amount
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Failed to perform action for order ${orderId}:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to perform action" },
      { status: 500 }
    );
  }
}
