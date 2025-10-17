// src/app/api/uploads/file/route.ts
import { NextResponse } from "next/server";
// FIX: The 'process' object is globally available in Node.js, so an explicit import is not needed and can cause build errors.

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbApiKey) {
      console.error(
        "ImgBB API key is not configured in environment variables."
      );
      return NextResponse.json(
        { error: "Server configuration error for file uploads" },
        { status: 500 }
      );
    }

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
