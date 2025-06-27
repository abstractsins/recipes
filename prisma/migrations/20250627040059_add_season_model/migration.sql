/*
  Warnings:

  - You are about to drop the column `seasons` on the `Ingredient` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "TagType" ADD VALUE 'season';

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "seasons",
ADD COLUMN     "seasonId" INTEGER;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "seasonId" INTEGER;

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonTag" (
    "tagId" INTEGER NOT NULL,
    "ingredientId" INTEGER,
    "recipeId" INTEGER,

    CONSTRAINT "SeasonTag_pkey" PRIMARY KEY ("tagId")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonTag" ADD CONSTRAINT "SeasonTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonTag" ADD CONSTRAINT "SeasonTag_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonTag" ADD CONSTRAINT "SeasonTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
