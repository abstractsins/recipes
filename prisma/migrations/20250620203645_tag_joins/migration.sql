/*
  Warnings:

  - You are about to drop the `_IngredientTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipeTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_IngredientTags" DROP CONSTRAINT "_IngredientTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientTags" DROP CONSTRAINT "_IngredientTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeTags" DROP CONSTRAINT "_RecipeTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeTags" DROP CONSTRAINT "_RecipeTags_B_fkey";

-- DropTable
DROP TABLE "_IngredientTags";

-- DropTable
DROP TABLE "_RecipeTags";

-- CreateTable
CREATE TABLE "IngredientTag" (
    "ingredientId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "IngredientTag_pkey" PRIMARY KEY ("ingredientId","tagId")
);

-- CreateTable
CREATE TABLE "RecipeTag" (
    "recipeId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "RecipeTag_pkey" PRIMARY KEY ("recipeId","tagId")
);

-- AddForeignKey
ALTER TABLE "IngredientTag" ADD CONSTRAINT "IngredientTag_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientTag" ADD CONSTRAINT "IngredientTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
