// src/app/api/uploads/file/route.ts
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Fetch user-specific ImgBB API key
    const userSettings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
      select: { imgbbApiKey: true },
    });

    if (!userSettings?.imgbbApiKey) {
      return NextResponse.json(
        {
          error:
            "Image hosting is not configured. Please add your ImgBB API key in Settings.",
        },
        { status: 400 }
      );
    }

    const imgbbApiKey = encrypt(userSettings.imgbbApiKey, session.user.id);

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    const apiUrl = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

    const res = await fetch(apiUrl, {
      method: "POST",
      body: uploadFormData,
    });

    const data = await res.json();

    if (res.ok && data.data && data.data.url) {
      return NextResponse.json({ success: true, url: data.data.url });
    } else {
      console.error(
        "ImgBB upload failed:",
        data.error?.message || "Unknown error"
      );
      return NextResponse.json(
        { error: "Failed to upload file to hosting service" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
