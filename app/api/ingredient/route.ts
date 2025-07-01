// app/api/ingredient/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { IngredientDTO } from '@/types/types';


const prisma = new PrismaClient();

//********** */
//* GET      */
//********** */
export async function GET() {
    try {
        const ingredients = await prisma.ingredient.findMany({
            include: {
                userTags: true,
                defaultTags: true,
                user: false,
                seasons: true
            }
        });
        return NextResponse.json(ingredients);
    } catch (err) {
        console.error('Error fetching ingredients:', err);
        return new NextResponse('Server error getting ingredients', { status: 500 });
    }
}

//********** */
//* POST     */
//********** */
export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as IngredientDTO;

        console.log(body);

        /* Basic validation */
        if (!body?.name || !body?.userId) {
            return new NextResponse('name and userId are required', { status: 400 });
        }

        /* Transaction keeps all-or-nothing */
        const ingredient = await prisma.$transaction(async (tx) => {
            /* 1 ── create the ingredient itself */
            const newIng = await tx.ingredient.create({
                data: {
                    name: body.name,
                    main: body.main,
                    variety: body.variety,
                    category: body.category,
                    subcategory: body.subcategory,
                    notes: body.notes,
                    userId: Number(body.userId),
                    seasons: body.selectedSeasonIndexes?.length
                        ? { connect: body.selectedSeasonIndexes.map(id => ({ id })) }
                        : undefined,
                },
            });

            /* 2 ── attach default tags if provided */
            if (body.selectedDefaultTagIndexes?.length) {
                await tx.ingredientDefaultTag.createMany({
                    data: body.selectedDefaultTagIndexes.map(tagId => ({
                        ingredientId: newIng.id,
                        tagId,
                    })),
                });
            }

            /* 3 ── attach user tags if provided */
            if (body.selectedUserTagIndexes?.length) {
                await tx.ingredientUserTag.createMany({
                    data: body.selectedUserTagIndexes.map(tagId => ({
                        ingredientId: newIng.id,
                        tagId,
                    })),
                });
            }

            return newIng;
        });

        return NextResponse.json(ingredient, { status: 201 });
    } catch (err) {
        console.error('[ingredient POST]', err);
        return new NextResponse('Failed to create ingredient', { status: 500 });
    }
}