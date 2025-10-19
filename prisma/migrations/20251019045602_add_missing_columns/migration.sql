-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "imgbbApiKey" TEXT;

-- AlterTable
ALTER TABLE "_ContactTags" ADD CONSTRAINT "_ContactTags_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "public"."_ContactTags_AB_unique";

-- AlterTable
ALTER TABLE "_GroupContacts" ADD CONSTRAINT "_GroupContacts_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "public"."_GroupContacts_AB_unique";
