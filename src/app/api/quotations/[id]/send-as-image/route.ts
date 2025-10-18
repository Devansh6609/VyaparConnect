import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWhatsAppImageMessage, WhatsAppCredentials } from "@/lib/whatsapp";
import { getIO } from "@/lib/socket";
import nodeHtmlToImage from "node-html-to-image";
import { Buffer } from "node:buffer";

async function getUserWhatsAppCredentials(
  userId: string
): Promise<WhatsAppCredentials | null> {
  const settings = await prisma.settings.findUnique({
    where: { userId },
  });
  if (
    settings &&
    settings.whatsappAccessToken &&
    settings.whatsappPhoneNumberId
  ) {
    return {
      token: settings.whatsappAccessToken,
      phoneId: settings.whatsappPhoneNumberId,
    };
  }
  return null;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: quotationId } = await context.params;
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { contact: true, items: { include: { product: true } } },
    });

    if (!quotation || !quotation.contact) {
      return NextResponse.json(
        { error: "Quotation or associated contact not found" },
        { status: 404 }
      );
    }

    // FIX: Get WhatsApp credentials for the user who owns the contact
    const creds = await getUserWhatsAppCredentials(quotation.contact.userId);
    if (!creds) {
      return NextResponse.json(
        {
          error:
            "WhatsApp is not configured for this user. Please check your settings.",
        },
        { status: 400 }
      );
    }

    // 1. Generate image buffer from HTML
    const html = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; width: 600px; background-color: #ffffff; color: #1a202c; }
                h1 { font-size: 32px; font-weight: bold; text-align: center; margin-bottom: 30px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; color: #4a5568; }
                .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 8px; font-size: 14px; text-align: left; }
                .table th { font-weight: bold; color: #2d3748; }
                .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
              </style>
            </head>
            <body>
              <h1>Quotation</h1>
              <div class="header">
                <div>
                  <strong>Billed To:</strong><br/>
                  ${quotation.customerName}<br/>
                  ${quotation.contactNumber}<br/>
                  ${quotation.billingAddress?.replace(/\n/g, "<br/>") || ""}
                </div>
                <div style="text-align: right;">
                  <strong>Quotation ID:</strong> ${quotation.id.substring(
                    0,
                    8
                  )}<br/>
                  <strong>Date:</strong> ${new Date(
                    quotation.createdAt
                  ).toLocaleDateString()}
                </div>
              </div>
              <table class="table">
                <thead><tr><th>Product</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th><th style="text-align:right;">Subtotal</th></tr></thead>
                <tbody>
                  ${quotation.items
                    .map(
                      (item: any) => `
                    <tr>
                      <td>${item.product?.name || "N/A"}</td>
                      <td style="text-align:center;">${item.quantity}</td>
                      <td style="text-align:right;">₹${item.price.toFixed(
                        2
                      )}</td>
                      <td style="text-align:right;">₹${(
                        item.quantity * item.price
                      ).toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
              <div class="total">Grand Total: ₹${quotation.total.toLocaleString(
                "en-IN"
              )}</div>
            </body>
          </html>
        `;

    const buffer = (await nodeHtmlToImage({
      html,
      puppeteerArgs: { args: ["--no-sandbox"] },
    })) as Buffer;

    // 2. Upload buffer to ImgBB to get a public URL
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
      console.error("ImgBB upload failed for quotation:", imgbbData);
      throw new Error("Failed to upload quotation image.");
    }
    const publicImageUrl = imgbbData.data.url;

    // 3. Send image via WhatsApp
    const caption = `Hi ${quotation.customerName}, here is the quotation you requested. Let us know if you'd like to proceed!`;
    const waResponse = await sendWhatsAppImageMessage(
      quotation.contact.phone,
      publicImageUrl,
      caption,
      creds
    );
    const wamid = waResponse?.messages?.[0]?.id;

    // 4. Save to our message history
    const savedMessage = await prisma.message.create({
      data: {
        from: "business",
        to: quotation.contact.phone,
        type: "image",
        text: caption,
        mediaUrl: publicImageUrl,
        contactId: quotation.contact.id,
        wamid: wamid,
        status: wamid ? "sent" : "failed",
      },
    });
    getIO()?.emit("newMessage", savedMessage);

    // 5. Update quotation status
    const updatedQuotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: "SENT" },
    });

    return NextResponse.json({ success: true, quotation: updatedQuotation });
  } catch (error) {
    console.error(`Failed to send quotation image for ${quotationId}:`, error);
    return NextResponse.json(
      { error: "Failed to send quotation" },
      { status: 500 }
    );
  }
}
