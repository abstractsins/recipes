/*
  Warnings:

  - You are about to drop the `IngredientTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IngredientTag" DROP CONSTRAINT "IngredientTag_defaultTagId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientTag" DROP CONSTRAINT "IngredientTag_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientTag" DROP CONSTRAINT "IngredientTag_userIngredientId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientTag" DROP CONSTRAINT "IngredientTag_userTagId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_defaultTagId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_userRecipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_userTagId_fkey";

-- AlterTable
ALTER TABLE "DefaultTag" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "UserTag" ADD COLUMN     "emoji" TEXT;

-- DropTable
DROP TABLE "IngredientTag";

-- DropTable
DROP TABLE "RecipeTag";

-- CreateTable
CREATE TABLE "RecipeDefaultTag" (
    "recipeId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "RecipeDefaultTag_pkey" PRIMARY KEY ("recipeId","tagId")
);

-- CreateTable
CREATE TABLE "RecipeUserTag" (
    "recipeId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "RecipeUserTag_pkey" PRIMARY KEY ("recipeId","tagId")
);

-- CreateTable
CREATE TABLE "IngredientDefaultTag" (
    "ingredientId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "IngredientDefaultTag_pkey" PRIMARY KEY ("ingredientId","tagId")
);

-- CreateTable
CREATE TABLE "IngredientUserTag" (
    "ingredientId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "IngredientUserTag_pkey" PRIMARY KEY ("ingredientId","tagId")
);

-- AddForeignKey
ALTER TABLE "RecipeDefaultTag" ADD CONSTRAINT "RecipeDefaultTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeDefaultTag" ADD CONSTRAINT "RecipeDefaultTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "DefaultTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeUserTag" ADD CONSTRAINT "RecipeUserTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeUserTag" ADD CONSTRAINT "RecipeUserTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "UserTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientDefaultTag" ADD CONSTRAINT "IngredientDefaultTag_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientDefaultTag" ADD CONSTRAINT "IngredientDefaultTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "DefaultTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientUserTag" ADD CONSTRAINT "IngredientUserTag_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientUserTag" ADD CONSTRAINT "IngredientUserTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "UserTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
