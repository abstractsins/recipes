/*
  Warnings:

  - You are about to drop the column `seasonId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `SeasonTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "SeasonTag" DROP CONSTRAINT "SeasonTag_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "SeasonTag" DROP CONSTRAINT "SeasonTag_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "SeasonTag" DROP CONSTRAINT "SeasonTag_tagId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "seasonId";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "seasonId";

-- DropTable
DROP TABLE "SeasonTag";

-- CreateTable
CREATE TABLE "_RecipeSeasons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RecipeSeasons_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IngredientSeasons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IngredientSeasons_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RecipeSeasons_B_index" ON "_RecipeSeasons"("B");

-- CreateIndex
CREATE INDEX "_IngredientSeasons_B_index" ON "_IngredientSeasons"("B");

-- AddForeignKey
ALTER TABLE "_RecipeSeasons" ADD CONSTRAINT "_RecipeSeasons_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeSeasons" ADD CONSTRAINT "_RecipeSeasons_B_fkey" FOREIGN KEY ("B") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientSeasons" ADD CONSTRAINT "_IngredientSeasons_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientSeasons" ADD CONSTRAINT "_IngredientSeasons_B_fkey" FOREIGN KEY ("B") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
