/*
  Warnings:

  - You are about to drop the `IngredientUserTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IngredientUserTag" DROP CONSTRAINT "IngredientUserTag_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientUserTag" DROP CONSTRAINT "IngredientUserTag_tagId_fkey";

-- DropTable
DROP TABLE "IngredientUserTag";

-- CreateTable
CREATE TABLE "_IngredientToUserTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IngredientToUserTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_IngredientToUserTag_B_index" ON "_IngredientToUserTag"("B");

-- AddForeignKey
ALTER TABLE "_IngredientToUserTag" ADD CONSTRAINT "_IngredientToUserTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientToUserTag" ADD CONSTRAINT "_IngredientToUserTag_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
