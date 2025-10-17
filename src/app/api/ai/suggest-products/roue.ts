// src/app/api/ai/suggest-products/route.ts
import { NextResponse } from "next/server";
// FIX: Import 'Type' enum for function calling schema.
import {
  GoogleGenAI,
  GenerateContentResponse,
  FunctionDeclaration,
  Type,
} from "@google/genai";
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

    // Define the function that the AI can call
    const searchProductsFunction: FunctionDeclaration = {
      name: "searchProducts",
      description:
        "Searches the business product catalog based on a user query about product features, name, or category.",
      parameters: {
        // FIX: Use 'Type.OBJECT' enum instead of string literal.
        type: Type.OBJECT,
        properties: {
          query: {
            // FIX: Use 'Type.STRING' enum instead of string literal.
            type: Type.STRING,
            description:
              'The search term derived from the customer\'s needs, like "durable travel bag" or "red cotton t-shirt".',
          },
        },
        required: ["query"],
      },
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the recent conversation and identify the customer's needs. Based on their request, call the searchProducts function with an appropriate query to find relevant items from the business catalog.\n\nConversation:\n${history}`,
      config: {
        tools: [{ functionDeclarations: [searchProductsFunction] }],
      },
    });

    const functionCalls = response.functionCalls;

    if (
      functionCalls &&
      functionCalls.length > 0 &&
      functionCalls[0].name === "searchProducts"
    ) {
      const searchQuery = functionCalls[0].args?.query;
      if (typeof searchQuery === "string") {
        return NextResponse.json({ query: searchQuery });
      }
    }

    // If the model didn't call the function, return an empty query
    return NextResponse.json({ query: "" });
  } catch (error) {
    console.error("AI Product Suggestion error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI product suggestions." },
      { status: 500 }
    );
  }
}
