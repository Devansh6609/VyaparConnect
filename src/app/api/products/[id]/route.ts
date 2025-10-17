import { NextResponse } from "next/server";
// FIX: Use the Prisma singleton instance to ensure a single connection pool and fix import errors.
import prisma from "@/lib/prisma";

// ✅ NEW GET endpoint: fetch single product by id
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// Existing PUT remains unchanged…
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const {
      name,
      description,
      price,
      imagesToAdd,
      imagesToDelete,
      category,
      inStock,
      stockQuantity,
      workflow,
    } = body;

    const updateData: any = {};
    if (typeof name !== "undefined") updateData.name = name;
    if (typeof description !== "undefined")
      updateData.description = description;
    if (typeof price !== "undefined" && price !== null) {
      updateData.price = typeof price === "string" ? parseFloat(price) : price;
    }
    if (typeof category !== "undefined") updateData.category = category;
    if (typeof inStock !== "undefined") updateData.inStock = inStock;
    if (typeof workflow !== "undefined") updateData.workflow = workflow;
    if (typeof stockQuantity !== "undefined" && stockQuantity !== null) {
      updateData.stockQuantity =
        typeof stockQuantity === "string"
          ? parseInt(stockQuantity, 10)
          : stockQuantity;
    }

    await prisma.$transaction(async (tx) => {
      if (Object.keys(updateData).length > 0) {
        await tx.product.update({ where: { id }, data: updateData });
      }

      if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
        await tx.productImage.deleteMany({
          where: { productId: id, id: { in: imagesToDelete } },
        });
      }

      if (Array.isArray(imagesToAdd) && imagesToAdd.length > 0) {
        await tx.productImage.createMany({
          data: imagesToAdd.map((url: string) => ({ url, productId: id })),
        });
      }
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT /api/products/[id] error", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// ✅ NEW DELETE handler
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Safety Check: Prevent deleting a product if it's part of a quotation.
    const linkedItems = await prisma.quotationItem.count({
      where: { productId: id },
    });

    if (linkedItems > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete. This product is used in ${linkedItems} quotation(s).`,
        },
        { status: 409 } // 409 Conflict is appropriate here
      );
    }

    // Proceed with deletion in a transaction for safety
    await prisma.$transaction([
      // Unlink from any messages (set productId to null)
      prisma.message.updateMany({
        where: { productId: id },
        data: { productId: null },
      }),
      // Delete all images associated with the product
      prisma.productImage.deleteMany({
        where: { productId: id },
      }),
      // Finally, delete the product itself
      prisma.product.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/products/[id] error", error);
    // Handle case where product to delete is not found
    if ((error as any).code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred while deleting the product." },
      { status: 500 }
    );
  }
}
