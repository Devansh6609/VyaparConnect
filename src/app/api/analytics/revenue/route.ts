// src/app/api/analytics/revenue/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "Date range is required" },
      { status: 400 }
    );
  }

  try {
    const startDate = startOfDay(new Date(from));
    const endDate = endOfDay(new Date(to));

    const payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        OR: [{ order: { userId: userId } }, { quotation: { userId: userId } }],
        status: "PAID",
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const revenueByDay: { [key: string]: number } = {};
    let currentDate = new Date(startDate);
    const diffDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

    // Pre-fill all days in the range with 0 revenue
    while (currentDate <= endDate) {
      revenueByDay[currentDate.toISOString().split("T")[0]] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    payments.forEach((p) => {
      const day = p.createdAt.toISOString().split("T")[0];
      if (revenueByDay[day] !== undefined) {
        revenueByDay[day] += p.amount;
      }
    });

    const formattedData = Object.keys(revenueByDay)
      .map((dateStr) => {
        const date = new Date(dateStr);
        const label =
          diffDays > 7
            ? date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              })
            : date.toLocaleDateString("en-US", {
                weekday: "short",
                timeZone: "UTC",
              });

        return {
          label: label,
          value: revenueByDay[dateStr],
          date: dateStr,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(({ date, ...rest }) => rest);

    return NextResponse.json(formattedData);
  } catch (err) {
    console.error("GET /api/analytics/revenue error", err);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
