// api/ingredient/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
import { IngredientDTO } from '@/types/types';


const prisma = new PrismaClient();

//********** */
//* GET      */
//********** */
export async function GET(req: NextRequest, { params }: any) {
    // await the promise exactly once
    const { id } = await params;
    const numericId = Number(id)
    if (Number.isNaN(numericId)) {
        return new NextResponse('Invalid ingredient ID; must be a number.', { status: 400 });
    }

    try {

        const ingredient = await prisma.ingredient.findUnique({
            where: { id: numericId },
            include: {
                seasons: true,
                defaultTags: true,
                userTags: true
            }
        });

        if (!ingredient) {
            return new NextResponse('Ingredient not found.', { status: 404 });
        }

        return NextResponse.json(ingredient);

    } catch (err) {
        console.error('Error fetching ingredient:', err);
        return new NextResponse('Server error.', { status: 500 });
    }
}



//**********
//* PUT    * 
//**********
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        /* ── 0  Validate route param ─────────────────────────────── */
        const id = Number(params.id);
        if (Number.isNaN(id)) {
            return new NextResponse('Invalid ingredient id', { status: 400 });
        }

        /* ── 1  Parse/validate body ──────────────────────────────── */
        const body = (await req.json()) as IngredientDTO;
        if (!body?.name || !body?.userId) {
            return new NextResponse('name and userId are required', { status: 400 });
        }

        /* ── 2  Transaction: update core row + relation tables ───── */
        const updatedIngredient = await prisma.$transaction(async (tx) => {
            /* 2-a  Update the ingredient record itself */
            const ing = await tx.ingredient.update({
                where: { id },
                data: {
                    name: body.name,
                    main: body.main,
                    variety: body.variety,
                    category: body.category,
                    subcategory: body.subcategory,
                    notes: body.notes,
                    userId: Number(body.userId),

                    // replace season links in one statement
                    seasons: body.selectedSeasonIndexes
                        ? { set: body.selectedSeasonIndexes.map((sid) => ({ id: sid })) }
                        : { set: [] },
                },
            });

            /* 2-b  Refresh default-tag junction rows */
            await tx.ingredientDefaultTag.deleteMany({ where: { ingredientId: id } });
            if (body.selectedDefaultTagIndexes?.length) {
                await tx.ingredientDefaultTag.createMany({
                    data: body.selectedDefaultTagIndexes.map((tagId) => ({
                        ingredientId: id,
                        tagId,
                    })),
                });
            }

            /* 2-c  Refresh user-tag junction rows */
            await tx.ingredientUserTag.deleteMany({ where: { ingredientId: id } });
            if (body.selectedUserTagIndexes?.length) {
                await tx.ingredientUserTag.createMany({
                    data: body.selectedUserTagIndexes.map((tagId) => ({
                        ingredientId: id,
                        tagId,
                    })),
                });
            }

            return ing;
        });

        /* ── 3  Success ──────────────────────────────────────────── */
        return NextResponse.json(updatedIngredient, { status: 200 });
    } catch (err) {
        console.error('[ingredient PUT]', err);
        return new NextResponse('Failed to update ingredient', { status: 500 });
    }
}
