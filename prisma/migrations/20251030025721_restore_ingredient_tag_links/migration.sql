BEGIN;

INSERT INTO "public"."IngredientDefaultTag" ("ingredientId", "tagId")
SELECT "ingredientId", "tagId"
FROM "public"."_IngredientDefaultTagMigrationBackup"
ON CONFLICT ("ingredientId", "tagId") DO NOTHING;

INSERT INTO "public"."IngredientUserTag" ("ingredientId", "tagId")
SELECT "ingredientId", "tagId"
FROM "public"."_IngredientUserTagMigrationBackup"
ON CONFLICT ("ingredientId", "tagId") DO NOTHING;

DROP TABLE "public"."_IngredientDefaultTagMigrationBackup";
DROP TABLE "public"."_IngredientUserTagMigrationBackup";

COMMIT;
