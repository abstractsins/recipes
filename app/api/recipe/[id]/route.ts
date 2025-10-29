import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: any
) {
    // await the promise exactly once
    const urlParams = await params
    const numericId = Number(urlParams.id)
    if (Number.isNaN(numericId)) {
        return new NextResponse('Invalid recipe ID; must be a number.', { status: 400 });
    }

    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: numericId },
            include: {
                ingredients: true,
                defaultTags: true,
                userTags: true,
                seasons: true
            }
        });

        if (!recipe) return new NextResponse('Recipe not found.', { status: 404 });

        return NextResponse.json(recipe);
    } catch (err) {
        console.error('Error fetching recipe:', err);
        return new NextResponse('Server error.', { status: 500 });
    }
}


//********** */
//* PUT      */
//********** */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const recipeId = Number(params.id);
        if (!Number.isInteger(recipeId)) {
            return new NextResponse('Invalid recipe ID.', { status: 400 });
        }

        const body = await req.json();
        const { name, ingredients, seasonIds, selectedSeasonIndexes } = body ?? {};

        // accept either key for seasons
        const rawSeasons = Array.isArray(seasonIds)
            ? seasonIds
            : Array.isArray(selectedSeasonIndexes)
                ? selectedSeasonIndexes
                : [];

        const seasonSet: number[] = [...new Set(
            rawSeasons.map((v: unknown) => Number(v)).filter((n) => Number.isInteger(n) && n > 0)
        )];

        // normalize ingredients payload (optional)
        const ingArray: Array<{
            ingredientId: number;
            quantity: string;
            unit: string;
            prepMethod?: string | null;
        }> = Array.isArray(ingredients) ? ingredients : [];

        // optional: verify seasons exist
        if (seasonSet.length) {
            const found = await prisma.season.findMany({
                where: { id: { in: seasonSet } },
                select: { id: true },
            });
            const have = new Set(found.map(f => f.id));
            const missing = seasonSet.filter(id => !have.has(id));
            if (missing.length) {
                return new NextResponse(`Invalid season id(s): ${missing.join(', ')}`, { status: 400 });
            }
        }

        const updated = await prisma.$transaction(async (tx) => {
            // 1) Update name and seasons (replace set) if provided
            const updateData: any = {};
            if (typeof name === 'string' && name.trim()) {
                updateData.name = name.trim();
            }
            if (Array.isArray(rawSeasons)) {
                // caller provided seasons; replace the links (can be [] to clear)
                updateData.seasons = { set: seasonSet.map((id) => ({ id })) };
            }

            if (Object.keys(updateData).length) {
                await tx.recipe.update({
                    where: { id: recipeId },
                    data: updateData,
                });
            }

            // 2) Replace recipe-ingredient rows if provided
            if (Array.isArray(ingredients)) {
                await tx.recipeIngredient.deleteMany({ where: { recipeId } });
                if (ingArray.length) {
                    await tx.recipeIngredient.createMany({
                        data: ingArray.map((ing) => ({
                            recipeId,
                            ingredientId: Number(ing.ingredientId),
                            quantity: ing.quantity,
                            unit: ing.unit,
                            prepMethod: ing.prepMethod ?? null,
                        })),
                        skipDuplicates: true,
                    });
                }
            }

            // 3) Return the full recipe with relations
            return tx.recipe.findUnique({
                where: { id: recipeId },
                include: {
                    seasons: true,
                    ingredients: {
                        include: { ingredient: true },
                    },
                    defaultTags: { include: { tag: true } },
                    userTags: { include: { tag: true } },
                },
            });
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (err) {
        console.error('Error editing recipe:', err);
        return new NextResponse('Server error editing recipe', { status: 500 });
    }
}