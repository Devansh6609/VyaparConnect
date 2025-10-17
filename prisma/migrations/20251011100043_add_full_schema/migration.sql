/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,whatsappGroupId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_quotationId_fkey";

-- DropIndex
DROP INDEX "Group_whatsappGroupId_key";

-- DropIndex
DROP INDEX "Payment_razorpayPaymentId_key";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "lastBillingAddress" TEXT,
ADD COLUMN     "lastShippingAddress" TEXT;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "shippingAddress" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PAID';

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "shippingAddress" TEXT;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "geminiApiKey" TEXT;

-- DropEnum
DROP TYPE "PaymentStatus";

-- CreateIndex
CREATE INDEX "Contact_userId_idx" ON "Contact"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_userId_whatsappGroupId_key" ON "Group"("userId", "whatsappGroupId");

-- CreateIndex
CREATE INDEX "Message_contactId_idx" ON "Message"("contactId");

-- CreateIndex
CREATE INDEX "Message_wamid_idx" ON "Message"("wamid");

-- CreateIndex
CREATE INDEX "Order_contactId_idx" ON "Order"("contactId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Payment_quotationId_idx" ON "Payment"("quotationId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

-- CreateIndex
CREATE INDEX "Quotation_contactId_idx" ON "Quotation"("contactId");

-- CreateIndex
CREATE INDEX "Quotation_userId_idx" ON "Quotation"("userId");

-- CreateIndex
CREATE INDEX "Reminder_status_remindAt_idx" ON "Reminder"("status", "remindAt");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
