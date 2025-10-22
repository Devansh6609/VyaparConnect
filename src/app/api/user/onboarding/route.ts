// src/app/api/user/onboarding/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

// FIX: Replaced import from @prisma/client with a local const enum pattern to resolve build errors.
const WorkflowType = {
  QUOTATION_FOCUSED: "QUOTATION_FOCUSED",
  ORDER_FOCUSED: "ORDER_FOCUSED",
  HYBRID: "HYBRID",
} as const;
type WorkflowType = (typeof WorkflowType)[keyof typeof WorkflowType];

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const { workflowType } = await req.json();

    // Validate the incoming workflowType
    if (!Object.values(WorkflowType).includes(workflowType)) {
      return NextResponse.json(
        { error: "Invalid workflow type" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure both updates succeed or fail together
    await prisma.$transaction([
      // Mark user's onboarding as complete
      prisma.user.update({
        where: { id: userId },
        data: { hasCompletedOnboarding: true },
      }),
      // Create or update their settings with the chosen workflow
      prisma.settings.upsert({
        where: { userId },
        update: { primaryWorkflow: workflowType },
        create: {
          userId: userId,
          primaryWorkflow: workflowType,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/user/onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
