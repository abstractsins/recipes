/*
  Warnings:

  - You are about to drop the column `prepMethod` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `RecipeIngredient` table. All the data in the column will be lost.
  - Added the required column `amount` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RecipeIngredient" DROP COLUMN "prepMethod",
DROP COLUMN "quantity",
ADD COLUMN     "amount" TEXT NOT NULL,
ADD COLUMN     "prep" TEXT;
