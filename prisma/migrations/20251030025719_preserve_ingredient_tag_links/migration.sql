BEGIN;

-- Run before the explicit-tag migration, without changing already-applied migrations.
CREATE TABLE "public"."_IngredientDefaultTagMigrationBackup" (
    "ingredientId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    PRIMARY KEY ("ingredientId", "tagId")
);

CREATE TABLE "public"."_IngredientUserTagMigrationBackup" (
    "ingredientId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    PRIMARY KEY ("ingredientId", "tagId")
);

DO $$
BEGIN
    IF EXISTS (
        SELECT "name" FROM "public"."Season"
        GROUP BY "name" HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Duplicate season names must be resolved before migrating ingredient tags; no tag links have been removed.';
    END IF;

    IF to_regclass('public."_DefaultTagToIngredient"') IS NOT NULL THEN
        INSERT INTO "public"."_IngredientDefaultTagMigrationBackup" ("ingredientId", "tagId")
        SELECT "B", "A" FROM "public"."_DefaultTagToIngredient";
    ELSIF to_regclass('public."IngredientDefaultTag"') IS NULL THEN
        RAISE EXCEPTION 'Neither the legacy nor explicit default ingredient tag table exists.';
    END IF;

    IF to_regclass('public."_IngredientToUserTag"') IS NOT NULL THEN
        INSERT INTO "public"."_IngredientUserTagMigrationBackup" ("ingredientId", "tagId")
        SELECT "A", "B" FROM "public"."_IngredientToUserTag";
    ELSIF to_regclass('public."IngredientUserTag"') IS NULL THEN
        RAISE EXCEPTION 'Neither the legacy nor explicit user ingredient tag table exists.';
    END IF;
END $$;

COMMIT;
