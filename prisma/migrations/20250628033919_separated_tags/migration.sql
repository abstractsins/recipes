/*
  Warnings:

  - You are about to drop the column `default` on the `RecipeTag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userRecipeId,userTagId]` on the table `RecipeTag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RecipeTag_recipeId_userTagId_key";

-- AlterTable
ALTER TABLE "RecipeTag" DROP COLUMN "default",
ADD COLUMN     "userRecipeId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTag_userRecipeId_userTagId_key" ON "RecipeTag"("userRecipeId", "userTagId");

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_userRecipeId_fkey" FOREIGN KEY ("userRecipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
