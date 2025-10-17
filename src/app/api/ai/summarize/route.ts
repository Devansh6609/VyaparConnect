// src/app/api/ai/summarize/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userSettings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
      select: { geminiApiKey: true },
    });

    if (!userSettings?.geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 400 }
      );
    }

    const decryptedApiKey = decrypt(userSettings.geminiApiKey);
    const { history } = await req.json();

    if (!history) {
      return NextResponse.json(
        { error: "Missing conversation history" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: decryptedApiKey });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a concise summary of this business conversation. Highlight key customer requests, mentioned products, agreed-upon prices or terms, and any unresolved action items. Format the summary with clear headings (e.g., 'Key Points:', 'Action Items:').\n\nConversation:\n${history}`,
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("AI summarization error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI summary." },
      { status: 500 }
    );
  }
}
