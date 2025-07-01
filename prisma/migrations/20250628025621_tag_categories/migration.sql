-- AlterTable
ALTER TABLE "IngredientTag" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'ingredient';

-- AlterTable
ALTER TABLE "RecipeTag" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'recipe';
