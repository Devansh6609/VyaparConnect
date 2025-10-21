// src/app/api/quotations/[id]/send-bill-action/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emitSocketEvent } from "@/lib/socket-server"; // CORRECTED IMPORT PATH
import {
  sendWhatsAppImageMessage,
  sendWhatsAppMessage,
  WhatsAppCredentials,
} from "@/lib/whatsapp";
// FIX: Removed top-level imports for Node-specific modules
// import Razorpay from "razorpay";
// import nodeHtmlToImage from "node-html-to-image";
import { Buffer } from "node:buffer";
import type { Quotation } from "../../../../../types";
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

type QuotationWithDetails = Quotation;

// --- HTML Template Helper ---
function getBillHtml(
  quotation: QuotationWithDetails,
  settings: Settings | null
): string {
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
            .totals { float: right; width: 40%; margin-top: 20px; font-size: 14px; }
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
                  ${
    settings?.companyAddress?.replace(/\n/g, "<br/>") || "Your Company Address"
  }
                </div>
              </div>
              <div class="bill-details">
                <h2>INVOICE</h2>
                <strong>Bill to:</strong> ${quotation.customerName}<br/>
                <strong>Quotation ID:</strong> #${quotation.id.substring(
    0,
    6
  )}<br/>
                <strong>Date:</strong> ${new Date(
    quotation.updatedAt
  ).toLocaleDateString()}
              </div>
            </div>
             <div class="address-section">
                <div><strong>Billing Address:</strong><br/>${
    quotation.billingAddress?.replace(/\n/g, "<br/>") || ""
  }</div>
                <div><strong>Shipping Address:</strong><br/>${
    quotation.shippingAddress?.replace(/\n/g, "<br/>") || ""
  }</div>
            </div>
            <table class="table">
              <thead><tr><th>Product</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th><th style="text-align:right;">Amount</th></tr></thead>
              <tbody>
                ${quotation.items
    .map(
      (item) => `
                  <tr>
                    <td>${item.product?.name || "N/A"}</td>
                    <td style="text-align:center;">${item.quantity}</td>
                    <td style="text-align:right;">₹${item.price.toFixed(2)}</td>
                    <td style="text-align:right;">₹${(
        item.quantity * item.price
      ).toFixed(2)}</td>
                  </tr>`
    )
    .join("")}
              </tbody>
            </table>
            <div class="totals">
              <div><span>Subtotal</span><span>₹${quotation.subtotal.toFixed(
    2
  )}</span></div>
              ${
    quotation.discountPercentage
      ? `<div><span>Discount (${
          quotation.discountPercentage
        }%)</span><span>- ₹${(
          (quotation.subtotal * quotation.discountPercentage) /
          100
        ).toFixed(2)}</span></div>`
      : ""
  }
              ${
    quotation.taxRate
      ? `<div><span>GST (${quotation.taxRate}%)</span><span>+ ₹${(
          ((quotation.subtotal -
            (quotation.subtotal * (quotation.discountPercentage || 0)) / 100) *
            quotation.taxRate) /
          100
        ).toFixed(2)}</span></div>`
      : ""
  }
              ${
    quotation.deliveryCharges
      ? `<div><span>Delivery</span><span>+ ₹${quotation.deliveryCharges.toFixed(
          2
        )}</span></div>`
      : ""
  }
              <div class="grand-total"><span>Grand Total</span><span>₹${quotation.total.toFixed(
    2
  )}</span></div>
            </div>
          </div>
        </body>
      </html>`;
}

// --- Generic Message Sending Helper with WAMID tracking ---
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

// --- Action Handlers ---

async function handleSendFinalBill(
  quotation: QuotationWithDetails,
  settings: Settings | null,
  creds: WhatsAppCredentials
) {
  // CRITICAL FIX: Dynamic import for node-html-to-image
  const { default: nodeHtmlToImage } = await import("node-html-to-image");

  const html = getBillHtml(quotation, settings);
  const buffer = (await nodeHtmlToImage({
    // nodeHtmlToImage is dynamically available here
    html,
    puppeteerArgs: { args: ["--no-sandbox"] },
  })) as Buffer;

  const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!imgbbApiKey)
    throw new Error("Server configuration error: ImgBB API key is not set.");

  const formData = new FormData();
  formData.append("image", buffer.toString("base64"));
  const imgbbRes = await fetch(
    `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
    { method: "POST", body: formData }
  );
  const imgbbData = await imgbbRes.json();

  if (!imgbbRes.ok) throw new Error("Failed to upload bill image.");

  const publicImageUrl = imgbbData.data.url;
  const caption = `Hi ${quotation.customerName}, please find your final bill attached.`;

  await createAndSendMessage(
    {
      from: "business",
      to: quotation.contact.phone,
      type: "image",
      text: caption,
      mediaUrl: publicImageUrl,
      contactId: quotation.contact.id,
    },
    () =>
      sendWhatsAppImageMessage(
        quotation.contact.phone,
        publicImageUrl,
        caption,
        creds
      )
  );
}

async function handleSendRazorpay(
  quotation: QuotationWithDetails,
  settings: Settings | null,
  amount: number,
  creds: WhatsAppCredentials
) {
  // CRITICAL FIX: Dynamic import for Razorpay
  const { default: Razorpay } = await import("razorpay");

  if (!settings?.razorpayKeyId || !settings?.razorpayKeySecret) {
    throw new Error("Razorpay API keys are not configured in settings.");
  }

  // Razorpay is dynamically available here
  const razorpay = new Razorpay({
    key_id: settings.razorpayKeyId,
    key_secret: settings.razorpayKeySecret,
  });

  const amountToCharge = amount > 0 ? amount : quotation.total;
  if (amountToCharge <= 0)
    throw new Error(
      "Cannot create a payment link for a zero or negative amount."
    );

  const paymentLink = await razorpay.paymentLink.create({
    amount: Math.round(amountToCharge * 100),
    currency: "INR",
    description: `Payment for Quotation #${quotation.id.substring(0, 6)}`,
    customer: {
      name: quotation.customerName,
      contact: quotation.contactNumber.replace("+", ""),
    },
    notify: { sms: true, email: false },
    reminder_enable: true,
    notes: { quotation_id: quotation.id },
    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/chat`,
    callback_method: "get",
  });

  await prisma.quotation.update({
    where: { id: quotation.id },
    data: {
      paymentLinkId: paymentLink.id,
      paymentLinkUrl: paymentLink.short_url,
    },
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
    throw new Error("Server configuration error: ImgBB API key is not set.");
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
  const caption = `Your final bill is *₹${amountToCharge.toFixed(
    2
  )}*. \nPlease scan the QR code to pay or click the link below:\n${
    paymentLink.short_url
  }`;

  await createAndSendMessage(
    {
      from: "business",
      to: quotation.contact.phone,
      type: "image",
      text: caption,
      mediaUrl: publicQrUrl,
      contactId: quotation.contact.id,
    },
    () =>
      sendWhatsAppImageMessage(
        quotation.contact.phone,
        publicQrUrl,
        caption,
        creds
      )
  );
}

async function handleSendBankDetails(
  quotation: QuotationWithDetails,
  settings: Settings | null,
  creds: WhatsAppCredentials
) {
  const bankDetailsText =
    settings?.bankName && settings?.bankAccountNumber && settings?.bankIfscCode
      ? `Bank Name: ${settings.bankName}\nAccount No: ${settings.bankAccountNumber}\nIFSC Code: ${settings.bankIfscCode}`
      : null;

  if (!bankDetailsText) {
    throw new Error("Bank details are not fully configured in settings.");
  }

  const totalPaid = quotation.payments.reduce((sum, p) => sum + p.amount, 0);
  const amountDue = quotation.total - totalPaid;
  if (amountDue <= 0) throw new Error("The bill is already paid in full.");

  const messageText = `A friendly reminder to complete the payment for your order. The remaining amount due is *₹${amountDue.toFixed(
    2
  )}*. \n\nYou can pay via bank transfer to:\n\n${bankDetailsText}`;

  await createAndSendMessage(
    {
      from: "business",
      to: quotation.contact.phone,
      type: "text",
      text: messageText,
      contactId: quotation.contact.id,
    },
    () => sendWhatsAppMessage(quotation.contact.phone, messageText, creds)
  );
}

async function handleSendQrCode(
  quotation: QuotationWithDetails,
  settings: Settings | null,
  creds: WhatsAppCredentials
) {
  if (!settings?.upiQrCodeUrl)
    throw new Error("UPI QR Code URL is not configured in settings.");
  const totalPaid = quotation.payments.reduce((sum, p) => sum + p.amount, 0);
  const amountDue = quotation.total - totalPaid;
  if (amountDue <= 0) throw new Error("The bill is already paid in full.");

  const caption = `Please scan this QR code to pay the remaining balance of *₹${amountDue.toFixed(
    2
  )}*.`;

  await createAndSendMessage(
    {
      from: "business",
      to: quotation.contact.phone,
      type: "image",
      text: caption,
      mediaUrl: settings.upiQrCodeUrl,
      contactId: quotation.contact.id,
    },
    () =>
      sendWhatsAppImageMessage(
        quotation.contact.phone,
        settings!.upiQrCodeUrl!,
        caption,
        creds
      )
  );
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

  const { id: quotationId } = await context.params;
  try {
    const { action, amount } = await req.json();

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        contact: true,
        items: { include: { product: true } },
        payments: true,
      },
    });

    if (!quotation || !quotation.contact) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Authorization check
    if (quotation.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userWithSettings = await prisma.user.findUnique({
      where: { id: quotation.userId },
      include: { settings: true },
    });

    if (!userWithSettings) {
      return NextResponse.json(
        { error: "Quotation owner not found." },
        { status: 404 }
      );
    }
    const settings = userWithSettings.settings;

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

    switch (action) {
      case "send_final_bill":
        await handleSendFinalBill(quotation, settings, creds);
        break;
      case "send_razorpay":
        await handleSendRazorpay(quotation, settings, amount, creds);
        break;
      case "send_bank_details":
        await handleSendBankDetails(quotation, settings, creds);
        break;
      case "send_qr_code":
        await handleSendQrCode(quotation, settings, creds);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action specified" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(
      `Failed to perform action for quotation ${quotationId}:`,
      error
    );
    return NextResponse.json(
      { error: error.message || "Failed to perform action" },
      { status: 500 }
    );
  }
}
