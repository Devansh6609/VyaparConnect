/*
  Warnings:

  - Made the column `productName` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderPaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentStatus" "OrderPaymentStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "status" "OrderItemStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "productName" SET NOT NULL,
ALTER COLUMN "productName" SET DEFAULT 'Unknown Product';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "orderId" TEXT,
ALTER COLUMN "quotationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
