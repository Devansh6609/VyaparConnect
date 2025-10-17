/*
  Warnings:

  - The `stage` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Reminder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Quotation" DROP CONSTRAINT "Quotation_contactId_fkey";

-- DropIndex
DROP INDEX "public"."Message_whatsappMessageId_key";

-- DropIndex
DROP INDEX "public"."Payment_razorpayOrderId_key";

-- AlterTable
ALTER TABLE "public"."Contact" ALTER COLUMN "isMasterCustomer" DROP NOT NULL,
DROP COLUMN "stage",
ADD COLUMN     "stage" TEXT DEFAULT 'NEW_LEAD';

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "fileName" TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "method" TEXT,
ADD COLUMN     "razorpaySignature" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "razorpayOrderId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Quotation" ADD COLUMN     "paymentLinkId" TEXT,
ADD COLUMN     "paymentLinkUrl" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT',
ALTER COLUMN "taxRate" DROP NOT NULL,
ALTER COLUMN "discountPercentage" DROP NOT NULL,
ALTER COLUMN "deliveryCharges" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Reminder" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "public"."ContactStage";

-- DropEnum
DROP TYPE "public"."ReminderStatus";

-- AddForeignKey
ALTER TABLE "public"."Quotation" ADD CONSTRAINT "Quotation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
