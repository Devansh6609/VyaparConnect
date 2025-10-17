/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayOrderId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `QuotationItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Settings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentLinkId]` on the table `Quotation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `method` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_replyToId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Settings" DROP CONSTRAINT "Settings_userId_fkey";

-- DropIndex
DROP INDEX "public"."Payment_razorpayOrderId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "updatedAt",
ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "participant" TEXT,
ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "contactId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "razorpayOrderId",
DROP COLUMN "updatedAt",
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "method" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Quotation" ALTER COLUMN "taxRate" SET DEFAULT 0,
ALTER COLUMN "discountPercentage" SET DEFAULT 0,
ALTER COLUMN "deliveryCharges" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "QuotationItem" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsappGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupToContact" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupToContact_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_whatsappGroupId_key" ON "Group"("whatsappGroupId");

-- CreateIndex
CREATE INDEX "_GroupToContact_B_index" ON "_GroupToContact"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_paymentLinkId_key" ON "Quotation"("paymentLinkId");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToContact" ADD CONSTRAINT "_GroupToContact_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToContact" ADD CONSTRAINT "_GroupToContact_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
