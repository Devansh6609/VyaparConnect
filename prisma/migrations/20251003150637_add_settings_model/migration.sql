/*
  Warnings:

  - You are about to drop the column `linkDescription` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `linkImage` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `linkTitle` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `linkUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappMessageId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_contactId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reminder" DROP CONSTRAINT "Reminder_contactId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "linkDescription",
DROP COLUMN "linkImage",
DROP COLUMN "linkTitle",
DROP COLUMN "linkUrl",
DROP COLUMN "price",
DROP COLUMN "whatsappMessageId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Quotation" ALTER COLUMN "taxRate" DROP DEFAULT,
ALTER COLUMN "discountPercentage" DROP DEFAULT,
ALTER COLUMN "deliveryCharges" DROP DEFAULT;

-- AlterTable
ALTER TABLE "QuotationItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "companyName" TEXT,
    "companyAddress" TEXT,
    "companyLogoUrl" TEXT,
    "bankDetails" TEXT,
    "upiQrCodeUrl" TEXT,
    "razorpayKeyId" TEXT,
    "razorpayKeySecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
