// src/app/api/settings/reveal-token/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getAuthSession } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

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

    let settings = await prisma.settings.findUnique({
      where: { userId: userId },
      select: { whatsappVerifyToken: true },
    });

    if (!settings || !settings.whatsappVerifyToken) {
      const newVerifyToken = randomUUID();
      await prisma.settings.upsert({
        where: { userId: userId },
        update: { whatsappVerifyToken: newVerifyToken },
        create: { userId: userId, whatsappVerifyToken: newVerifyToken },
      });
      return NextResponse.json({ token: newVerifyToken });
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
