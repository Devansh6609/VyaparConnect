import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
// FIX: Changed path alias to relative path to resolve module resolution error.
import { WorkflowType } from "../../../types";

// GET /api/products → list all products for the logged-in user, filtered by workflow
export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userWorkflow = session.user.primaryWorkflow;
    let whereClause: any = { userId: session.user.id };

    if (userWorkflow === "QUOTATION_FOCUSED") {
      whereClause.workflow = { in: ["QUOTATION_FOCUSED", "HYBRID"] };
    } else if (userWorkflow === "ORDER_FOCUSED") {
      whereClause.workflow = { in: ["ORDER_FOCUSED", "HYBRID"] };
    }
    // No workflow filter needed for 'HYBRID' user, they see all products.

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products → create a new product for the logged-in user
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      price,
      description,
      category,
      inStock,
      stockQuantity,
      images,
      workflow,
    } = body;

    if (!name || !price || !workflow) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, price, and workflow are required",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: typeof price === "string" ? parseFloat(price) : price,
        description: description || null,
        category: category || null,
        inStock: typeof inStock === "boolean" ? inStock : true,
        stockQuantity:
          typeof stockQuantity === "string"
            ? parseInt(stockQuantity, 10)
            : stockQuantity || 0,
        workflow,
        userId: session.user.id,
        images: {
          create: (Array.isArray(images) ? images : []).map((url: string) => ({
            url,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
