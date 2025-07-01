/*
  Warnings:

  - You are about to drop the column `color` on the `DefaultTag` table. All the data in the column will be lost.
  - You are about to drop the column `emoji` on the `UserTag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DefaultTag" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "UserTag" DROP COLUMN "emoji",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
