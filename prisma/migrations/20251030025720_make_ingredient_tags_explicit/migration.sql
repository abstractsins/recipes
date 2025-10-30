/*
  Warnings:

  - You are about to drop the `_DefaultTagToIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IngredientToUserTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Season` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."_DefaultTagToIngredient" DROP CONSTRAINT "_DefaultTagToIngredient_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DefaultTagToIngredient" DROP CONSTRAINT "_DefaultTagToIngredient_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_IngredientToUserTag" DROP CONSTRAINT "_IngredientToUserTag_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_IngredientToUserTag" DROP CONSTRAINT "_IngredientToUserTag_B_fkey";

-- AlterTable
ALTER TABLE "public"."Ingredient" ADD COLUMN     "defaultTagId" INTEGER,
ADD COLUMN     "userTagId" INTEGER;

-- DropTable
DROP TABLE "public"."_DefaultTagToIngredient";

-- DropTable
DROP TABLE "public"."_IngredientToUserTag";

-- CreateTable
CREATE TABLE "public"."IngredientDefaultTag" (
    "ingredientId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "IngredientDefaultTag_pkey" PRIMARY KEY ("ingredientId","tagId")
);

-- CreateTable
CREATE TABLE "public"."IngredientUserTag" (
    "ingredientId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "IngredientUserTag_pkey" PRIMARY KEY ("ingredientId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_name_key" ON "public"."Season"("name");

-- AddForeignKey
ALTER TABLE "public"."IngredientDefaultTag" ADD CONSTRAINT "IngredientDefaultTag_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IngredientDefaultTag" ADD CONSTRAINT "IngredientDefaultTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."DefaultTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IngredientUserTag" ADD CONSTRAINT "IngredientUserTag_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IngredientUserTag" ADD CONSTRAINT "IngredientUserTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."UserTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingredient" ADD CONSTRAINT "Ingredient_defaultTagId_fkey" FOREIGN KEY ("defaultTagId") REFERENCES "public"."DefaultTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingredient" ADD CONSTRAINT "Ingredient_userTagId_fkey" FOREIGN KEY ("userTagId") REFERENCES "public"."UserTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
