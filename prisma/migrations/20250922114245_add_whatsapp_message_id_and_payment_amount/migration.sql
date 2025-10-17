/*
  Warnings:

  - A unique constraint covering the columns `[whatsappMessageId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "whatsappMessageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_whatsappMessageId_key" ON "public"."Message"("whatsappMessageId");
