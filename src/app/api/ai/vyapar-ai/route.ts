// src/app/api/ai/vyapar-ai/route.ts
import { NextResponse } from "next/server";
import {
  GoogleGenAI,
  GenerateContentResponse,
  FunctionDeclaration,
  Type,
  Content,
} from "@google/genai";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { arrayToCsv } from "@/lib/csv";
import {
  startOfMonth,
  endOfMonth,
  subDays,
  startOfDay,
  subMonths,
  startOfYear,
  endOfYear,
} from "date-fns";

// --- Function Declarations for Gemini ---

const getBusinessDataFunction: FunctionDeclaration = {
  name: "getBusinessData",
  description:
    "Fetches business data (orders, items, customers) with optional filters for time period, customer tags, and payment status to answer analytical questions.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      timePeriod: {
        type: Type.STRING,
        description:
          "The time period for the data. Can be 'today', 'last_7_days', 'this_month', 'last_month', 'this_year', or 'all_time'. Defaults to 'all_time' if not specified.",
      },
      customerTags: {
        type: Type.ARRAY,
        description:
          "An array of customer tag names to filter the data by, e.g., ['VIP', 'Wholesale'].",
        items: { type: Type.STRING },
      },
      paymentStatus: {
        type: Type.STRING,
        description:
          "Filter orders by a specific payment status. Can be 'UNPAID', 'PARTIALLY_PAID', or 'PAID'.",
      },
    },
  },
};

const getProductDetailsFunction: FunctionDeclaration = {
  name: "getProductDetails",
  description:
    "Retrieves details for a specific product, such as its current stock quantity and price.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      productName: {
        type: Type.STRING,
        description: "The name of the product to query.",
      },
    },
    required: ["productName"],
  },
};

const addTagToContactFunction: FunctionDeclaration = {
  name: "addTagToContact",
  description: "Adds a new or existing tag to a specified customer.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      customerName: {
        type: Type.STRING,
        description: "The name of the customer to add the tag to.",
      },
      tagName: {
        type: Type.STRING,
        description: "The name of the tag to add, e.g., 'Wholesale' or 'VIP'.",
      },
    },
    required: ["customerName", "tagName"],
  },
};

const exportCustomerDataFunction: FunctionDeclaration = {
  name: "exportCustomerData",
  description:
    "Exports a customer's orders, payments, or quotations to a CSV file. Use this when the user asks to download, export, or get a file of a customer's data.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      customerName: {
        type: Type.STRING,
        description: "The name of the customer whose data should be exported.",
      },
      dataType: {
        type: Type.STRING,
        description:
          "The type of data to export. Must be one of: 'orders', 'payments', or 'quotations'.",
      },
    },
    required: ["customerName", "dataType"],
  },
};

const navigateToFunction: FunctionDeclaration = {
  name: "navigateTo",
  description:
    'Navigates the user to a specific page within the VyaparConnect application. Use this when the user asks to "go to settings", "open chats", "show me my orders", etc.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      page: {
        type: Type.STRING,
        description:
          "The page to navigate to. Must be one of '/', '/chat', '/orders', '/quotations', '/broadcasts', '/groups', '/settings', '/profile'.",
      },
    },
    required: ["page"],
  },
};

const createBroadcastFunction: FunctionDeclaration = {
  name: "createBroadcast",
  description:
    'Initiates creating a new broadcast message to customers with specific tags. Use this when the user asks to "send a message to all VIPs", "create a new broadcast", etc.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      targetTags: {
        type: Type.ARRAY,
        description:
          "An array of customer tag names to target with the broadcast.",
        items: { type: Type.STRING },
      },
      message: {
        type: Type.STRING,
        description: "The content of the message to be broadcast.",
      },
    },
    required: ["targetTags", "message"],
  },
};

const updateProductDetailsFunction: FunctionDeclaration = {
  name: "updateProductDetails",
  description:
    "Updates the details of an existing product in the catalog, such as its price, stock quantity, or description.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      productName: {
        type: Type.STRING,
        description: "The name of the product to update.",
      },
      newPrice: {
        type: Type.NUMBER,
        description: "The new price for the product.",
      },
      newStockQuantity: {
        type: Type.INTEGER,
        description: "The new stock quantity for the product.",
      },
      newDescription: {
        type: Type.STRING,
        description: "The new description for the product.",
      },
    },
    required: ["productName"],
  },
};

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#8b5cf6",
  "#d946ef",
  "#64748b",
];
const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

// --- Main Handler ---
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const userSettings = await prisma.settings.findUnique({
      where: { userId },
      select: { geminiApiKey: true },
    });

    if (!userSettings?.geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 400 }
      );
    }

    const decryptedApiKey = decrypt(userSettings.geminiApiKey);
    const { history } = (await req.json()) as { history: AIMessage[] };

    if (!history || history.length === 0) {
      return NextResponse.json(
        { error: "Missing conversation history" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: decryptedApiKey });

    const geminiHistory: Content[] = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: geminiHistory,
      config: {
        systemInstruction:
          "You are VyaparAI, an assistant for a business owner. Your goal is to answer questions about their business by using the provided tools to access data. You can also perform actions like navigating pages, managing products and customers, or creating broadcasts. Be helpful and concise. All monetary values should be presented in Indian Rupees (INR) with the symbol '₹'.",
        tools: [
          {
            functionDeclarations: [
              getBusinessDataFunction,
              getProductDetailsFunction,
              updateProductDetailsFunction,
              addTagToContactFunction,
              exportCustomerDataFunction,
              navigateToFunction,
              createBroadcastFunction,
            ],
          },
        ],
      },
    });

    const functionCalls = response.functionCalls;

    // --- Handle Function Calling ---
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      let functionResponseContent: any = { success: true };

      // Add the model's function call to the history
      geminiHistory.push({ role: "model", parts: [{ functionCall: call }] });

      // --- Execute Tool Logic ---

      if (call.name === "addTagToContact") {
        const { customerName, tagName } = call.args as {
          customerName: string;
          tagName: string;
        };
        const contact = await prisma.contact.findFirst({
          where: {
            name: { equals: customerName, mode: "insensitive" },
            userId,
          },
        });
        if (!contact) {
          functionResponseContent = {
            success: false,
            error: `Customer '${customerName}' not found.`,
          };
        } else {
          // `upsert` was causing a build error, so we use findFirst + create to work around it.
          // This handles finding an existing tag or creating a new one.
          let tag = await prisma.tag.findFirst({
            where: { name: tagName, userId: userId },
          });

          if (!tag) {
            try {
              tag = await prisma.tag.create({
                data: { name: tagName, color: randomColor(), userId },
              });
            } catch (e: any) {
              // This catch block handles a race condition: if another request creates the same tag
              // between our `findFirst` and `create` calls, the `create` will fail with a
              // unique constraint violation (P2002). We then re-fetch the tag.
              if (e.code === "P2002") {
                tag = await prisma.tag.findFirst({
                  where: { name: tagName, userId: userId },
                });
              } else {
                // For any other error, we re-throw it.
                throw e;
              }
            }
          }

          if (!tag) {
            // If tag is still not found (very unlikely), we can't proceed.
            functionResponseContent = {
              success: false,
              error: `Could not create or find tag '${tagName}'.`,
            };
          } else {
            await prisma.contact.update({
              where: { id: contact.id },
              data: { tags: { connect: { id: tag.id } } },
            });
            functionResponseContent = {
              success: true,
              message: `Tag '${tagName}' was added to ${customerName}.`,
            };
          }
        }
      } else if (call.name === "getProductDetails") {
        const { productName } = call.args as { productName: string };
        const product = await prisma.product.findFirst({
          where: { name: { equals: productName, mode: "insensitive" }, userId },
          select: {
            name: true,
            price: true,
            stockQuantity: true,
            description: true,
          },
        });
        if (!product) {
          functionResponseContent = {
            success: false,
            error: `Product '${productName}' not found.`,
          };
        } else {
          functionResponseContent = { success: true, product };
        }
      } else if (call.name === "updateProductDetails") {
        const { productName, newPrice, newStockQuantity, newDescription } =
          call.args as any;
        const product = await prisma.product.findFirst({
          where: { name: { equals: productName, mode: "insensitive" }, userId },
        });

        if (!product) {
          functionResponseContent = {
            success: false,
            error: `Product '${productName}' not found.`,
          };
        } else {
          const updateData: any = {};
          if (newPrice !== undefined) updateData.price = newPrice;
          if (newStockQuantity !== undefined)
            updateData.stockQuantity = newStockQuantity;
          if (newDescription !== undefined)
            updateData.description = newDescription;

          if (Object.keys(updateData).length > 0) {
            await prisma.product.update({
              where: { id: product.id },
              data: updateData,
            });
            functionResponseContent = {
              success: true,
              message: `Successfully updated ${productName}.`,
            };
          } else {
            functionResponseContent = {
              success: false,
              error: `No update information was provided for ${productName}.`,
            };
          }
        }
      } else if (call.name === "getBusinessData") {
        const { timePeriod, customerTags, paymentStatus } = call.args as any;
        const now = new Date();
        const whereClause: any = { userId };

        if (timePeriod) {
          let gte: Date | undefined;
          if (timePeriod === "today") gte = startOfDay(now);
          if (timePeriod === "last_7_days") gte = startOfDay(subDays(now, 7));
          if (timePeriod === "this_month") gte = startOfMonth(now);
          if (timePeriod === "last_month") {
            const lastMonth = subMonths(now, 1);
            gte = startOfMonth(lastMonth);
            whereClause.createdAt.lte = endOfMonth(lastMonth);
          }
          if (timePeriod === "this_year") gte = startOfYear(now);
          if (gte) whereClause.createdAt = { gte };
        }
        if (customerTags && customerTags.length > 0) {
          whereClause.contact = {
            tags: { some: { name: { in: customerTags, mode: "insensitive" } } },
          };
        }
        if (paymentStatus) {
          whereClause.paymentStatus = paymentStatus;
        }

        const fetchedData = await prisma.order.findMany({
          where: whereClause,
          select: {
            customerName: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            items: {
              select: { productName: true, quantity: true, price: true },
            },
          },
        });

        if (!fetchedData || fetchedData.length === 0) {
          functionResponseContent = {
            success: false,
            error: `I couldn't find any order data for the specified criteria.`,
          };
        } else {
          functionResponseContent = { success: true, data: fetchedData };
        }
      }

      // --- Send function response back to Gemini for final answer ---
      geminiHistory.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: call.name,
              response: functionResponseContent,
            },
          },
        ],
      });

      const secondResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: geminiHistory,
        config: {
          systemInstruction:
            "You are VyaparAI. You have just executed a tool and received a result. Formulate a natural, user-friendly response based on the tool's output. All monetary values should be presented in Indian Rupees (INR) with the symbol '₹'.",
        },
      });

      return NextResponse.json({ text: secondResponse.text });
    }

    // --- Handle Standard Text Response if no function was called ---
    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Vyapar AI error:", error);
    if (error.message && error.message.includes("GoogleGenerativeAI")) {
      return NextResponse.json(
        {
          error:
            "The AI service is currently unavailable or experiencing issues.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to get AI response." },
      { status: 500 }
    );
  }
}
