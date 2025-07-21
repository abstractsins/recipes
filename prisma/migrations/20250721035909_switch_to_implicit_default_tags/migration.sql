/*
  Warnings:

  - You are about to drop the `IngredientDefaultTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IngredientDefaultTag" DROP CONSTRAINT "IngredientDefaultTag_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientDefaultTag" DROP CONSTRAINT "IngredientDefaultTag_tagId_fkey";

-- DropTable
DROP TABLE "IngredientDefaultTag";

-- CreateTable
CREATE TABLE "_DefaultTagToIngredient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DefaultTagToIngredient_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DefaultTagToIngredient_B_index" ON "_DefaultTagToIngredient"("B");

-- AddForeignKey
ALTER TABLE "_DefaultTagToIngredient" ADD CONSTRAINT "_DefaultTagToIngredient_A_fkey" FOREIGN KEY ("A") REFERENCES "DefaultTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultTagToIngredient" ADD CONSTRAINT "_DefaultTagToIngredient_B_fkey" FOREIGN KEY ("B") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
