// src/app/api/cron/send-reminders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWhatsAppMessage, WhatsAppCredentials } from "@/lib/whatsapp";
import { emitSocketEvent } from "@/lib/socket-server";

// Helper to send message via WhatsApp Graph API
async function sendAndLogMessage(
  to: string,
  text: string,
  contactId: string,
  creds: WhatsAppCredentials
) {
  try {
    const waResponse = await sendWhatsAppMessage(to, text, creds);
    const wamid = waResponse?.messages?.[0]?.id;

    // Save the automated message to our DB for history
    const savedMessage = await prisma.message.create({
      data: {
        from: "business",
        to: to,
        type: "text",
        text: `[Automated Reminder] ${text}`,
        contactId: contactId,
        wamid: wamid,
        status: wamid ? "sent" : "failed", // FIX: Added required status field
      },
    });
    await emitSocketEvent("newMessage", savedMessage);

    return { success: !!wamid };
  } catch (err) {
    console.error(`Error sending reminder to ${to}:`, err);
    return { success: false };
  }
}

export async function GET(req: Request) {
  // In a real application, you would secure this endpoint, e.g., with a secret key
  // const { searchParams } = new URL(req.url);
  // if (searchParams.get('CRON_SECRET') !== process.env.CRON_SECRET) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const now = new Date();
    const pendingReminders = await prisma.reminder.findMany({
      where: {
        status: "PENDING",
        remindAt: { lte: now },
      },
      include: {
        contact: {
          include: {
            user: {
              include: {
                settings: true,
              },
            },
          },
        },
      },
    });

    let sentCount = 0;
    for (const reminder of pendingReminders) {
      // Check if a customer message should be sent
      if (reminder.customerMessage && reminder.contact?.phone) {
        const settings = reminder.contact.user?.settings;
        const creds: WhatsAppCredentials | null =
          settings?.whatsappAccessToken && settings?.whatsappPhoneNumberId
            ? {
                token: settings.whatsappAccessToken,
                phoneId: settings.whatsappPhoneNumberId,
              }
            : null;

        if (creds) {
          const result = await sendAndLogMessage(
            reminder.contact.phone,
            reminder.customerMessage,
            reminder.contactId,
            creds
          );
          if (result.success) {
            sentCount++;
          }
        } else {
          console.warn(
            `Skipping reminder ${reminder.id} for user ${reminder.contact.user?.id} because WhatsApp is not configured.`
          );
        }
      }

      // Mark reminder as completed regardless of whether a customer message was sent
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { status: "COMPLETED" },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${pendingReminders.length} reminders. Sent ${sentCount} customer messages.`,
    });
  } catch (error) {
    console.error("Cron job for reminders failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
