/*
  Warnings:

  - You are about to drop the column `bankDetails` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "bankDetails",
ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "bankIfscCode" TEXT,
ADD COLUMN     "bankName" TEXT;
