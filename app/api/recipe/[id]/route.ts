import { RecipeDTO } from '@/types/types';
import { PrismaClient } from '@prisma/client';
import { connect } from 'http2';
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
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const recipeId = Number(id);
        if (!Number.isInteger(recipeId)) {
            return new NextResponse('Invalid recipe ID.', { status: 400 });
        }

        const body: RecipeDTO = await req.json();
        const {
            name,
            translation,
            altName,
            ingredients, // you’re not using this yet
            userId,
            selectedSeasons,         // <-- seasons by label
            selectedDefaultTagIds,
            selectedUserTagIds,
        } = body ?? {};

        const updated = await prisma.$transaction(async (tx) => {
            const updateData: any = {};

            // 1) scalars
            if (typeof name === 'string' && name.trim()) {
                updateData.name = name.trim();
            }
            if (typeof userId === 'number') {
                updateData.userId = userId;
            }
            if (typeof translation === 'string') {
                updateData.translation = translation;
            }
            if (typeof altName === 'string') {
                updateData.altName = altName;
            }


            // 2) seasons (implicit M2M, replace)
            if (Array.isArray(selectedSeasons)) {
                updateData.seasons = {
                    set: selectedSeasons.map((name) => ({ name })), // must exist in Season
                };
            }

            // if we have *any* scalar/seasons, flush them first
            if (Object.keys(updateData).length) {
                await tx.recipe.update({
                    where: { id: recipeId },
                    data: updateData,
                });
            }

            // 3) default tags (explicit now)
            if (Array.isArray(selectedDefaultTagIds)) {
                // wipe existing joins
                await tx.recipeDefaultTag.deleteMany({
                    where: { recipeId },
                });

                const cleanIds = [
                    ...new Set(
                        selectedDefaultTagIds
                            .map(Number)
                            .filter((n) => Number.isInteger(n) && n > 0)
                    ),
                ];

                if (cleanIds.length) {
                    await tx.recipe.update({
                        where: { id: recipeId },
                        data: {
                            defaultTags: {
                                create: cleanIds.map((tagId) => ({
                                    tag: { connect: { id: tagId } },
                                })),
                            },
                        },
                    });
                }
            }

            // 4) user tags (explicit now)
            if (Array.isArray(selectedUserTagIds)) {
                await tx.recipeUserTag.deleteMany({
                    where: { recipeId },
                });

                const cleanIds = [
                    ...new Set(
                        selectedUserTagIds
                            .map(Number)
                            .filter((n) => Number.isInteger(n) && n > 0)
                    ),
                ];

                if (cleanIds.length) {
                    await tx.recipe.update({
                        where: { id: recipeId },
                        data: {
                            userTags: {
                                create: cleanIds.map((tagId) => ({
                                    tag: { connect: { id: tagId } },
                                })),
                            },
                        },
                    });
                }
            }

            // 5) return fresh
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