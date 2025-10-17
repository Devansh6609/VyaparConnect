import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Exclude password from the response
    const { password, ...userData } = user;
    return NextResponse.json(userData);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const body = await req.json();
    const { name, currentPassword, newPassword } = body;

    const updateData: { name?: string; password?: string } = {};

    // Handle name update
    if (name && name !== user.name) {
      updateData.name = name;
    }

    // Handle password change
    if (newPassword && currentPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid current password" },
          { status: 400 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters long" },
          { status: 400 }
        );
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    if (Object.keys(updateData).length === 0) {
      // Return current user data if no changes were made
      const { password, ...userData } = user;
      return NextResponse.json(userData, { status: 200 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const { password, ...userData } = updatedUser;
    return NextResponse.json(userData);
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
