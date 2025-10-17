/*
  Warnings:

  - The `status` column on the `Broadcast` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `BroadcastRecipient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `stage` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `participant` on the `Message` table. All the data in the column will be lost.
  - The `status` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Made the column `templateId` on table `Broadcast` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `from` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `contactId` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `type` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `productName` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ContactStage" AS ENUM ('NEW_LEAD', 'CONTACTED', 'QUOTATION_SENT', 'PAYMENT_PENDING', 'COMPLETED', 'LOST');

-- CreateEnum
CREATE TYPE "MessageFrom" AS ENUM ('business', 'customer');

-- CreateEnum
CREATE TYPE "BroadcastStatus" AS ENUM ('PENDING', 'SENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "BroadcastRecipientStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_groupId_fkey";

-- DropForeignKey
ALTER TABLE "QuotationItem" DROP CONSTRAINT "QuotationItem_productId_fkey";

-- DropIndex
DROP INDEX "Quotation_paymentLinkId_key";

-- DropIndex
DROP INDEX "Settings_whatsappPhoneNumberId_key";

-- AlterTable
ALTER TABLE "Broadcast" ALTER COLUMN "templateId" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BroadcastStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "BroadcastRecipient" DROP COLUMN "status",
ADD COLUMN     "status" "BroadcastRecipientStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "stage",
ADD COLUMN     "stage" "ContactStage" NOT NULL DEFAULT 'NEW_LEAD';

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "participant",
DROP COLUMN "from",
ADD COLUMN     "from" "MessageFrom" NOT NULL,
ALTER COLUMN "contactId" SET NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "MessageType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "discountPercentage" DROP DEFAULT,
ALTER COLUMN "deliveryCharges" DROP DEFAULT;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "productName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "workflow" "WorkflowType" NOT NULL DEFAULT 'HYBRID';

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "notes" TEXT,
ALTER COLUMN "taxRate" DROP DEFAULT,
ALTER COLUMN "discountPercentage" DROP DEFAULT,
ALTER COLUMN "deliveryCharges" DROP DEFAULT;

-- AlterTable
ALTER TABLE "QuotationItem" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Settings" ALTER COLUMN "primaryWorkflow" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
