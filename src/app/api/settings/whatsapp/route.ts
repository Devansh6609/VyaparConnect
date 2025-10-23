import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
      select: {
        whatsappPhoneNumberId: true,
        whatsappBusinessAccountId: true,
        whatsappAccessToken: true,
      },
    });

    const settingsToReturn = { ...settings };
    // Never send the actual token to the client. Send a placeholder.
    if (settingsToReturn?.whatsappAccessToken) {
      settingsToReturn.whatsappAccessToken = "••••••••••••••••••••••••••••••••";
    }

    return NextResponse.json(settingsToReturn || {});
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
  if (!session?.user?.id) {
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

    if (!whatsappPhoneNumberId || !whatsappBusinessAccountId) {
      return NextResponse.json(
        { error: "Phone Number ID and Business Account ID are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      whatsappPhoneNumberId,
      whatsappBusinessAccountId,
    };

    // Only update the token if a new, non-placeholder value is provided.
    if (whatsappAccessToken && !whatsappAccessToken.startsWith("•")) {
      updateData.whatsappAccessToken = encrypt(whatsappAccessToken);
    }

    const createData = {
      userId,
      whatsappPhoneNumberId,
      whatsappBusinessAccountId,
      ...(whatsappAccessToken &&
        !whatsappAccessToken.startsWith("•") && {
          whatsappAccessToken: encrypt(whatsappAccessToken),
        }),
    };

    const updatedSettings = await prisma.settings.upsert({
      where: { userId },
      update: updateData,
      create: createData,
      select: {
        whatsappPhoneNumberId: true,
        whatsappBusinessAccountId: true,
        whatsappAccessToken: true,
      },
    });

    const settingsToReturn = { ...updatedSettings };
    if (settingsToReturn.whatsappAccessToken) {
      settingsToReturn.whatsappAccessToken = "••••••••••••••••••••••••••••••••";
    }

    return NextResponse.json(settingsToReturn);
  } catch (error) {
    console.error("POST /api/settings/whatsapp error:", error);
    return NextResponse.json(
      { error: "Failed to save WhatsApp settings" },
      { status: 500 }
    );
  }
}
