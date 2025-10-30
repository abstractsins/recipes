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
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);
        if (!Number.isInteger(numericId)) {
            return new NextResponse('Invalid recipe ID.', { status: 400 });
        }

        const body: RecipeDTO = await req.json();
        const {
            name,
            ingredients,
            selectedSeasons
        } = body ?? {};


        const updated = await prisma.$transaction(async (tx) => {
            // 1) Update name and seasons (replace set) if provided
            const updateData: any = {};
            if (typeof name === 'string' && name.trim()) {
                updateData.name = name.trim();
            }
            if (Array.isArray(selectedSeasons)) {
                // caller provided seasons; replace the links (can be [] to clear)
                updateData.seasons = { set: selectedSeasons.map((s) => ({ name: s.label })) };
            }

            if (Object.keys(updateData).length) {
                await tx.recipe.update({
                    where: { id: numericId },
                    data: updateData,
                });
            }


            // Return the full recipe with relations
            return tx.recipe.findUnique({
                where: { id: numericId },
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