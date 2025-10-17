/*
  Warnings:

  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `razorpaySignature` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpayPaymentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `isMasterCustomer` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_contactId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Quotation" DROP CONSTRAINT "Quotation_contactId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reminder" DROP CONSTRAINT "Reminder_contactId_fkey";

-- AlterTable
ALTER TABLE "public"."Contact" ALTER COLUMN "isMasterCustomer" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "replyToId" TEXT,
ADD COLUMN     "replyToMediaUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "method",
DROP COLUMN "razorpaySignature",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."Quotation" ALTER COLUMN "taxRate" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "public"."Payment"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON "public"."Payment"("razorpayPaymentId");

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "public"."Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reminder" ADD CONSTRAINT "Reminder_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quotation" ADD CONSTRAINT "Quotation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
