/*
  Warnings:

  - The primary key for the `_ContactTags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_GroupContacts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_ContactTags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_GroupContacts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_ContactTags" DROP CONSTRAINT "_ContactTags_AB_pkey";

-- AlterTable
ALTER TABLE "_GroupContacts" DROP CONSTRAINT "_GroupContacts_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_ContactTags_AB_unique" ON "_ContactTags"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupContacts_AB_unique" ON "_GroupContacts"("A", "B");
