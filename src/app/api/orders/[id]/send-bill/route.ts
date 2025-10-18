// src/app/api/orders/[id]/send-bill/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";
import { sendWhatsAppImageMessage, WhatsAppCredentials } from "@/lib/whatsapp";
import nodeHtmlToImage from "node-html-to-image";
import { Buffer } from "node:buffer";
// FIX: Replaced imports from @prisma/client as they cause build errors. Using local/app types instead.
import type { Order } from "../../../../../types";
import { getAuthSession } from "@/lib/auth";

// Re-defining Settings locally as it is not exported from @prisma/client in this environment.
interface Settings {
  companyName?: string | null;
  companyAddress?: string | null;
  companyLogoUrl?: string | null;
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
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
            .address-section { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 12px; color: #555; }
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
                <strong>Order ID:</strong> #${order.id.substring(0, 6)}<br/>
                <strong>Date:</strong> ${new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </div>
            </div>
             <div class="address-section">
                <div><strong>Billed To:</strong><br/>${
                  order.customerName
                }<br/>${
    order.billingAddress?.replace(/\n/g, "<br/>") || ""
  }</div>
                <div><strong>Shipped To:</strong><br/>${
                  order.customerName
                }<br/>${
    order.shippingAddress?.replace(/\n/g, "<br/>") || ""
  }</div>
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

// --- Main Handler ---
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id: orderId } = await context.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { contact: true, items: true, payments: true },
    });

    if (!order || !order.contact) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    if (!creds) {
      throw new Error(
        "WhatsApp API credentials are not configured in settings."
      );
    }

    // 1. Generate Bill Image
    const html = getBillHtml(order as any, settings);
    const buffer = (await nodeHtmlToImage({
      html,
      puppeteerArgs: { args: ["--no-sandbox"] },
    })) as Buffer;

    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbApiKey) {
      console.error("ImgBB API key is not configured.");
      throw new Error("Server configuration error for file uploads.");
    }

    const formData = new FormData();
    formData.append("image", buffer.toString("base64"));

    const imgbbRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const imgbbData = await imgbbRes.json();
    if (!imgbbRes.ok || !imgbbData.data?.url) {
      console.error("ImgBB upload failed for order bill:", imgbbData);
      throw new Error("Failed to upload bill image.");
    }
    const publicImageUrl = imgbbData.data.url;

    // 2. Send via WhatsApp
    const caption = `Hi ${order.customerName}, thank you for your order! Please find the bill attached.`;

    const savedMessage = await prisma.message.create({
      data: {
        from: "business",
        to: order.contact.phone,
        type: "image",
        text: caption,
        mediaUrl: publicImageUrl,
        contactId: order.contact.id,
        status: "pending",
      },
      include: { contact: true },
    });
    getIO()?.emit("newMessage", savedMessage);

    const waResponse = await sendWhatsAppImageMessage(
      order.contact.phone,
      publicImageUrl,
      caption,
      creds
    );
    const wamid = waResponse?.messages?.[0]?.id;

    // 3. Update message status
    const finalStatus = wamid ? "sent" : "failed";
    const updatedMessage = await prisma.message.update({
      where: { id: savedMessage.id },
      data: { wamid: wamid, status: finalStatus },
    });
    getIO()?.emit("message-status-update", {
      id: updatedMessage.id,
      status: finalStatus,
      wamid: wamid,
    });

    if (!wamid) {
      throw new Error("Failed to send message via WhatsApp.");
    }

    // 4. Update order status to 'Confirmed'
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED" },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error(`Failed to send bill for order ${orderId}:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to send bill" },
      { status: 500 }
    );
  }
}
