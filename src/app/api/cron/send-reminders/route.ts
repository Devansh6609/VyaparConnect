// src/app/api/cron/send-reminders/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to send message via WhatsApp Graph API
async function sendWhatsAppMessage(to: string, text: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!accessToken || !phoneId) {
    console.error("WhatsApp credentials missing from .env");
    return { success: false, error: "WhatsApp credentials missing" };
  }
  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({
        messaging_product: "whatsapp", to, type: 'text', text: { body: text },
      }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to send WhatsApp reminder:", JSON.stringify(errorData, null, 2));
        return { success: false, error: "API call failed" };
    }
    return { success: true };
  } catch (err) {
    console.error("Error in sendWhatsAppMessage:", err);
    return { success: false, error: "Fetch failed" };
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
                status: 'PENDING',
                remindAt: { lte: now },
            },
            include: { contact: true },
        });

        let sentCount = 0;
        for (const reminder of pendingReminders) {
            // Send customer message if it exists
            if (reminder.customerMessage && reminder.contact.phone) {
                const result = await sendWhatsAppMessage(reminder.contact.phone, reminder.customerMessage);
                if (result.success) {
                    // Save the automated message to our DB for history
                    await prisma.message.create({
                        data: {
                            from: 'business',
                            to: reminder.contact.phone,
                            type: 'text',
                            text: `[Automated Reminder] ${reminder.customerMessage}`,
                            contactId: reminder.contactId,
                        }
                    });
                    sentCount++;
                }
            }

            // Mark reminder as completed regardless of whether a customer message was sent
            await prisma.reminder.update({
                where: { id: reminder.id },
                data: { status: 'COMPLETED' },
            });
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${pendingReminders.length} reminders. Sent ${sentCount} customer messages.`,
        });

    } catch (error) {
        console.error("Cron job for reminders failed:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
