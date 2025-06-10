-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('recipe', 'ingredient');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user',
ADD COLUMN     "username" TEXT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "main" TEXT,
    "variety" TEXT,
    "category" TEXT,
    "subcategory" TEXT,
    "seasons" TEXT[],
    "notes" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TagType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RecipeTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RecipeTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IngredientToRecipe" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IngredientToRecipe_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IngredientTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IngredientTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_userId_name_key" ON "Recipe"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_userId_name_key" ON "Ingredient"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_type_key" ON "Tag"("name", "type");

-- CreateIndex
CREATE INDEX "_RecipeTags_B_index" ON "_RecipeTags"("B");

-- CreateIndex
CREATE INDEX "_IngredientToRecipe_B_index" ON "_IngredientToRecipe"("B");

-- CreateIndex
CREATE INDEX "_IngredientTags_B_index" ON "_IngredientTags"("B");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeTags" ADD CONSTRAINT "_RecipeTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeTags" ADD CONSTRAINT "_RecipeTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientToRecipe" ADD CONSTRAINT "_IngredientToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientToRecipe" ADD CONSTRAINT "_IngredientToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientTags" ADD CONSTRAINT "_IngredientTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientTags" ADD CONSTRAINT "_IngredientTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
