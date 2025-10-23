// src/app/api/settings/reveal-token/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    const settings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
      select: { whatsappVerifyToken: true },
    });

    if (!settings?.whatsappVerifyToken) {
      return NextResponse.json(
        { error: "Verification token not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ token: settings.whatsappVerifyToken });
  } catch (error) {
    console.error("reveal-token error:", error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}
