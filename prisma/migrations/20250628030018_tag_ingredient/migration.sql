/*
  Warnings:

  - You are about to drop the column `category` on the `IngredientTag` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `RecipeTag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IngredientTag" DROP COLUMN "category",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'ingredient';

-- AlterTable
ALTER TABLE "RecipeTag" DROP COLUMN "category",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'recipe';
