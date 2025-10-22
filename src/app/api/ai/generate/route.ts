import { NextResponse } from "next/server";
import {
  GoogleGenAI,
  GenerateContentResponse,
  FunctionDeclaration,
  Type,
} from "@google/genai";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";

const createOrderFunction: FunctionDeclaration = {
  name: "createOrder",
  description:
    'Initiates the process of creating a new order for the current customer. Use this when the user asks to "create an order", "make a new order", or similar phrases.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Fetch the user-specific API key from the database
    const userSettings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
      select: { geminiApiKey: true },
    });

    if (!userSettings?.geminiApiKey) {
      return NextResponse.json(
        {
          error:
            "Gemini API key not configured. Please set it in your application settings.",
        },
        { status: 400 }
      );
    }

    // Decrypt the key on the server
    const decryptedApiKey = decrypt(userSettings.geminiApiKey);

    const { command, history } = await req.json();

    if (!command || !history) {
      return NextResponse.json(
        { error: "Missing command or history" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: decryptedApiKey });

    const fullPrompt = `
            Conversation History:
            ${history}

            User's Command: ${command}
        `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction:
          "You are VyaparAI, a helpful and professional assistant for a small business owner. Your tone is friendly, concise, and focused on being helpful. When asked to draft a message, provide only the message content. When asked to perform an action like creating an order, use the available tools.",
        tools: [{ functionDeclarations: [createOrderFunction] }],
      },
    });

    const functionCalls = response.functionCalls;
    if (
      functionCalls &&
      functionCalls.length > 0 &&
      functionCalls[0].name === "createOrder"
    ) {
      return NextResponse.json({ functionCall: functionCalls[0] });
    }

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("AI generation error:", error);
    // Provide a more specific error if decryption fails due to a bad key.
    if (error instanceof Error && error.message.includes("ENCRYPTION_KEY")) {
      return NextResponse.json(
        { error: "Server configuration error: Could not process API key." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate AI response." },
      { status: 500 }
    );
  }
}
