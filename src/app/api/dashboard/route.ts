// src/app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { addDays, format } from "date-fns";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { decrypt } from "@/lib/crypto";
import type { PendingPaymentItem } from "../../../types";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;
  const now = new Date();

  const startOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  try {
    // 1. KPIs
    const today = startOfDay(now);
    const yesterday = startOfDay(addDays(now, -1));

    const revenueToday = await prisma.payment.aggregate({
      where: { order: { userId }, createdAt: { gte: today } },
      _sum: { amount: true },
    });
    const revenueYesterday = await prisma.payment.aggregate({
      where: { order: { userId }, createdAt: { gte: yesterday, lt: today } },
      _sum: { amount: true },
    });

    const newCustomersToday = await prisma.contact.count({
      where: { userId, createdAt: { gte: today } },
    });
    const newCustomersYesterday = await prisma.contact.count({
      where: { userId, createdAt: { gte: yesterday, lt: today } },
    });

    const ordersToday = await prisma.order.count({
      where: { userId, createdAt: { gte: today } },
    });
    const ordersYesterday = await prisma.order.count({
      where: { userId, createdAt: { gte: yesterday, lt: today } },
    });

    // PENDING PAYMENTS LOGIC
    const pendingOrdersForPayment = await prisma.order.findMany({
      where: { userId, paymentStatus: { in: ["UNPAID", "PARTIALLY_PAID"] } },
      select: {
        id: true,
        customerName: true,
        total: true,
        contactId: true,
        updatedAt: true,
        payments: { select: { amount: true } },
      },
    });
    const pendingQuotationsForPayment = await prisma.quotation.findMany({
      where: { userId, status: { in: ["BILLED", "PARTIALLY_PAID"] } },
      select: {
        id: true,
        customerName: true,
        total: true,
        contactId: true,
        updatedAt: true,
        payments: { select: { amount: true } },
      },
    });

    const orderPaymentItems: PendingPaymentItem[] = pendingOrdersForPayment.map(
      (o) => ({ ...o, type: "order", updatedAt: o.updatedAt.toISOString() })
    );
    const quotationPaymentItems: PendingPaymentItem[] =
      pendingQuotationsForPayment.map((q) => ({
        ...q,
        type: "quotation",
        updatedAt: q.updatedAt.toISOString(),
      }));

    const pendingPaymentItems = [
      ...orderPaymentItems,
      ...quotationPaymentItems,
    ].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const totalPendingOrdersValue = pendingOrdersForPayment.reduce((sum, o) => {
      const paid = o.payments.reduce((pSum, p) => pSum + p.amount, 0);
      return sum + (o.total - paid);
    }, 0);
    const totalPendingQuotationsValue = pendingQuotationsForPayment.reduce(
      (sum, q) => {
        const paid = q.payments.reduce((pSum, p) => pSum + p.amount, 0);
        return sum + (q.total - paid);
      },
      0
    );

    const pendingPayments =
      totalPendingOrdersValue + totalPendingQuotationsValue;

    // 2. Revenue Chart (Last 7 Days)
    const sevenDaysAgo = startOfDay(addDays(now, -6));
    const paymentsLast7Days = await prisma.payment.findMany({
      where: { order: { userId }, createdAt: { gte: sevenDaysAgo } },
      select: { amount: true, createdAt: true },
    });

    const revenueByDay: { [key: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, -i);
      revenueByDay[format(date, "yyyy-MM-dd")] = 0;
    }

    paymentsLast7Days.forEach((p) => {
      const day = format(p.createdAt, "yyyy-MM-dd");
      if (revenueByDay[day] !== undefined) {
        revenueByDay[day] += p.amount;
      }
    });

    const revenueLast7Days = Object.keys(revenueByDay)
      .sort()
      .map((dateStr) => ({
        day: format(new Date(dateStr), "eee"),
        revenue: revenueByDay[dateStr],
      }));

    // 3. Recent Activity (last 5 updated contacts)
    const recentActivity = await prisma.contact.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const recentActivityFormatted = recentActivity.map((c) => ({
      ...c,
      tags: [],
      lastMessage: c.messages[0]?.text || "No messages yet",
      lastMessageAt: (c.messages[0]?.createdAt || c.updatedAt).toISOString(),
    }));

    // 4. Sales Funnel
    const salesFunnel = await prisma.contact.groupBy({
      by: ["stage"],
      where: { userId },
      _count: { stage: true },
    });

    // 5. Follow-up items
    const threeDaysAgo = addDays(now, -3);
    const thirtyDaysAgoForFollowup = addDays(now, -30);
    const followUpItems = await prisma.quotation.findMany({
      where: {
        userId,
        status: "SENT",
        updatedAt: { lte: threeDaysAgo, gte: thirtyDaysAgoForFollowup },
        reminders: { none: {} },
      },
      select: {
        id: true,
        contactId: true,
        customerName: true,
        total: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "asc" },
      take: 5,
    });

    // 6. Pending Orders
    const pendingOrders = await prisma.order.findMany({
      where: { userId, status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 5,
      include: { items: true, contact: true, payments: true },
    });

    const totalRevenue = revenueToday._sum.amount || 0;
    const prevRevenue = revenueYesterday._sum.amount || 0;
    const revenueChange =
      prevRevenue > 0
        ? ((totalRevenue - prevRevenue) / prevRevenue) * 100
        : totalRevenue > 0
        ? 100
        : 0;

    const newCustomers = newCustomersToday;
    const newCustomersChange =
      newCustomersYesterday > 0
        ? ((newCustomers - newCustomersYesterday) / newCustomersYesterday) * 100
        : newCustomers > 0
        ? 100
        : 0;

    const totalOrders = ordersToday;
    const totalOrdersChange =
      ordersYesterday > 0
        ? ((totalOrders - ordersYesterday) / ordersYesterday) * 100
        : totalOrders > 0
        ? 100
        : 0;

    const data: any = {
      totalRevenue,
      revenueChange,
      newCustomers,
      newCustomersChange,
      totalOrders,
      totalOrdersChange,
      pendingPayments,
      pendingPaymentItems,
      revenueLast7Days,
      recentActivity: recentActivityFormatted,
      salesFunnel: salesFunnel.map((s) => ({
        stage: s.stage,
        count: s._count.stage,
      })),
      followUpItems: followUpItems.map((q) => ({
        quotationId: q.id,
        contactId: q.contactId,
        contactName: q.customerName,
        quotationTotal: q.total,
        sentAt: q.updatedAt.toISOString(),
      })),
      pendingOrders,
    };

    // 7. AI Summary Generation
    try {
      const userSettings = await prisma.settings.findUnique({
        where: { userId },
        select: { geminiApiKey: true },
      });
      if (userSettings?.geminiApiKey) {
        const decryptedApiKey = decrypt(userSettings.geminiApiKey);
        const ai = new GoogleGenAI({ apiKey: decryptedApiKey });

        const prompt = `
                You are a business analyst AI for VyaparConnect. Your goal is to provide sharp, actionable insights for a small business owner based on their dashboard data. Be concise and use markdown for formatting (e.g., * for list items, ** for bolding key terms). All monetary values are in Indian Rupees (INR) and should be presented with the symbol '₹'.

                Here is the data for today:
                - Total Revenue: ₹${
                  data.totalRevenue
                } (Change from yesterday: ${data.revenueChange.toFixed(1)}%)
                - New Customers: ${
                  data.newCustomers
                } (Change from yesterday: ${data.newCustomersChange.toFixed(
          1
        )}%)
                - Total Orders: ${
                  data.totalOrders
                } (Change from yesterday: ${data.totalOrdersChange.toFixed(1)}%)
                - Total Value of Pending Payments: ₹${data.pendingPayments}

                Sales Funnel:
                ${data.salesFunnel
                  .map((s: any) => `- ${s.stage}: ${s.count} customers`)
                  .join("\n")}

                Action Items:
                - Follow-Ups Needed: ${
                  data.followUpItems.length
                } quotations sent more than 3 days ago.
                - Pending Orders to Process: ${data.pendingOrders.length}

                Based on this data, provide a summary with:
                1. A brief **Overall Summary** of today's performance.
                2. **Key Insights** drawing connections between different data points.
                3. **Actionable Suggestions** for what the business owner should do next.
                4. Finally, add a "### You can ask me:" section with 3 example questions the user could ask the Vyapar AI assistant, formatted as a markdown list. Examples: "Export all orders for [a real customer name from recent activity]" or "Who are my top 5 customers by revenue this month?". Use a real customer name from the recent activity if available: ${
                  data.recentActivity[0]?.name || "a customer"
                }.
            `;

        const response: GenerateContentResponse =
          await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });

        data.aiSummary = response.text;
      }
    } catch (aiError) {
      console.error("AI Summary Generation failed:", aiError);
      // Do not fail the whole request, just log the error and continue without AI summary.
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/dashboard error", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
