/*
  Warnings:

  - Added the required column `ingredientName` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RecipeIngredient" ADD COLUMN     "ingredientName" TEXT NOT NULL;
