// src/app/api/ai/smart-replies/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userSettings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
      select: { geminiApiKey: true },
    });

    if (!userSettings?.geminiApiKey) {
      // Silently fail if key is not configured, as this is a non-critical feature
      return NextResponse.json({ replies: [] });
    }

    const decryptedApiKey = decrypt(userSettings.geminiApiKey, session.user.id);
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
      contents: `Based on the last customer message in this conversation, generate an array of three short, relevant, and helpful reply suggestions for a business owner. The replies should be concise and ready to send.\n\nConversation:\n${history}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replies: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
        },
      },
    });

    // The response text is a JSON string, parse it.
    const responseText = response.text;
    if (!responseText) {
      // If the model returns no text, gracefully return an empty array.
      return NextResponse.json({ replies: [] });
    }
    const jsonResponse = JSON.parse(responseText);

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Smart Replies generation error:", error);
    // Don't throw a visible error to the user, just return empty array
    return NextResponse.json({ replies: [] });
  }
}
