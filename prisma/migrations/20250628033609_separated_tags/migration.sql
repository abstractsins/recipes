/*
  Warnings:

  - The primary key for the `IngredientTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tagId` on the `IngredientTag` table. All the data in the column will be lost.
  - The primary key for the `RecipeTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tagId` on the `RecipeTag` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ingredientId,defaultTagId]` on the table `IngredientTag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userIngredientId,userTagId]` on the table `IngredientTag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,defaultTagId]` on the table `RecipeTag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,userTagId]` on the table `RecipeTag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `default` to the `RecipeTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IngredientTag" DROP CONSTRAINT "IngredientTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_createdBy_fkey";

-- AlterTable
ALTER TABLE "IngredientTag" DROP CONSTRAINT "IngredientTag_pkey",
DROP COLUMN "tagId",
ADD COLUMN     "defaultTagId" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "userIngredientId" INTEGER,
ADD COLUMN     "userTagId" INTEGER,
ADD CONSTRAINT "IngredientTag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_pkey",
DROP COLUMN "tagId",
ADD COLUMN     "default" BOOLEAN NOT NULL,
ADD COLUMN     "defaultTagId" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "userTagId" INTEGER,
ADD CONSTRAINT "RecipeTag_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Tag";

-- CreateTable
CREATE TABLE "DefaultTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TagType" NOT NULL,

    CONSTRAINT "DefaultTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TagType" NOT NULL,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "UserTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DefaultTag_name_type_key" ON "DefaultTag"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "UserTag_name_type_createdBy_key" ON "UserTag"("name", "type", "createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientTag_ingredientId_defaultTagId_key" ON "IngredientTag"("ingredientId", "defaultTagId");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientTag_userIngredientId_userTagId_key" ON "IngredientTag"("userIngredientId", "userTagId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTag_recipeId_defaultTagId_key" ON "RecipeTag"("recipeId", "defaultTagId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTag_recipeId_userTagId_key" ON "RecipeTag"("recipeId", "userTagId");

-- AddForeignKey
ALTER TABLE "UserTag" ADD CONSTRAINT "UserTag_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientTag" ADD CONSTRAINT "IngredientTag_defaultTagId_fkey" FOREIGN KEY ("defaultTagId") REFERENCES "DefaultTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientTag" ADD CONSTRAINT "IngredientTag_userIngredientId_fkey" FOREIGN KEY ("userIngredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientTag" ADD CONSTRAINT "IngredientTag_userTagId_fkey" FOREIGN KEY ("userTagId") REFERENCES "UserTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_defaultTagId_fkey" FOREIGN KEY ("defaultTagId") REFERENCES "DefaultTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_userTagId_fkey" FOREIGN KEY ("userTagId") REFERENCES "UserTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
