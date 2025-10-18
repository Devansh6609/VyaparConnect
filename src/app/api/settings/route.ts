// src/app/api/settings/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";

// GET /api/settings -> fetch settings for the current user
export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
    });

    const settingsToReturn = { ...settings };
    // Never send the actual keys to the client. Send placeholders.
    if (settingsToReturn?.geminiApiKey) {
      settingsToReturn.geminiApiKey = "••••••••••••••••••••••••••••••••";
    }
    if (settingsToReturn?.imgbbApiKey) {
      settingsToReturn.imgbbApiKey = "••••••••••••••••••••••••";
    }

    return NextResponse.json(settingsToReturn || {});
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST /api/settings -> create or update settings for the current user
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await req.json();
    const {
      companyName,
      companyAddress,
      companyLogoUrl,
      bankName,
      bankAccountNumber,
      bankIfscCode,
      upiQrCodeUrl,
      razorpayKeyId,
      razorpayKeySecret,
      primaryWorkflow,
      geminiApiKey,
      imgbbApiKey,
    } = body;

    const updateData: any = {
      companyName,
      companyAddress,
      companyLogoUrl,
      bankName,
      bankAccountNumber,
      bankIfscCode,
      upiQrCodeUrl,
      razorpayKeyId,
      razorpayKeySecret,
      primaryWorkflow,
    };

    // Only update API keys if a new, non-placeholder value is provided.
    if (geminiApiKey && !geminiApiKey.startsWith("•")) {
      updateData.geminiApiKey = encrypt(geminiApiKey);
    } else if (geminiApiKey === "") {
      updateData.geminiApiKey = null;
    }

    if (imgbbApiKey && !imgbbApiKey.startsWith("•")) {
      updateData.imgbbApiKey = encrypt(imgbbApiKey);
    } else if (imgbbApiKey === "") {
      updateData.imgbbApiKey = null;
    }

    const updatedSettings = await prisma.settings.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });

    const settingsToReturn = { ...updatedSettings };
    if (settingsToReturn.geminiApiKey) {
      settingsToReturn.geminiApiKey = "••••••••••••••••••••••••••••••••";
    }
    if (settingsToReturn.imgbbApiKey) {
      settingsToReturn.imgbbApiKey = "••••••••••••••••••••••••";
    }

    return NextResponse.json(settingsToReturn, { status: 200 });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
