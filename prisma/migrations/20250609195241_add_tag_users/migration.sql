/*
  Warnings:

  - A unique constraint covering the columns `[name,type,createdBy]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tag_name_type_key";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "createdBy" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_type_createdBy_key" ON "Tag"("name", "type", "createdBy");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
