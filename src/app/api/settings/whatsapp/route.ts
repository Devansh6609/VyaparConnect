import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import crypto from "crypto";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
      select: {
        whatsappPhoneNumberId: true,
        whatsappBusinessAccountId: true,
        whatsappAccessToken: true,
        whatsappVerifyToken: true,
      },
    });

    // Return empty object if no settings, so frontend can show empty form
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("GET /api/settings/whatsapp error:", error);
    return NextResponse.json(
      { error: "Failed to fetch WhatsApp settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await req.json();
    const {
      whatsappPhoneNumberId,
      whatsappBusinessAccountId,
      whatsappAccessToken,
    } = body;

    if (
      !whatsappPhoneNumberId ||
      !whatsappBusinessAccountId ||
      !whatsappAccessToken
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingSettings = await prisma.settings.findUnique({
      where: { userId },
    });

    let verifyToken = existingSettings?.whatsappVerifyToken;
    if (!verifyToken) {
      // Generate a unique, secure token if one doesn't exist
      verifyToken = crypto.randomBytes(20).toString("hex");
    }

    const updatedSettings = await prisma.settings.upsert({
      where: { userId },
      update: {
        whatsappPhoneNumberId,
        whatsappBusinessAccountId,
        whatsappAccessToken, // Note: In a production app, encrypt this value before saving!
        whatsappVerifyToken: verifyToken,
      },
      create: {
        userId,
        whatsappPhoneNumberId,
        whatsappBusinessAccountId,
        whatsappAccessToken,
        whatsappVerifyToken: verifyToken,
      },
      select: {
        whatsappPhoneNumberId: true,
        whatsappBusinessAccountId: true,
        whatsappAccessToken: true,
        whatsappVerifyToken: true,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("POST /api/settings/whatsapp error:", error);
    return NextResponse.json(
      { error: "Failed to save WhatsApp settings" },
      { status: 500 }
    );
  }
}
