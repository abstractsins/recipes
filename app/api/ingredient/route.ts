// app/api/ingredient/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';   // ← pull in Prisma types
import { IngredientDTO } from '@/types/types';
import { mapPrismaCodeToStatus, humanMessage } from '@/utils/utils';

const prisma = new PrismaClient();

//********** */
//* GET      */
//********** */
export async function GET() {
    try {
        const ingredients = await prisma.ingredient.findMany({
            include: {
                user: false,
                seasons: true,
                userTags: true,
                recipes: true,
                defaultTags: true,
            },
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

        if (!body?.name || !body?.userId) {
            return new NextResponse('name and userId are required', { status: 400 });
        }

        const ingredient = await prisma.$transaction(async (tx) => {
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
                        ? { connect: body.selectedSeasonIndexes.map((id) => ({ id })) }
                        : undefined,
                    defaultTags: body.selectedDefaultTagIndexes?.length
                        ? { connect: body.selectedDefaultTagIndexes.map((id) => ({ id })) }
                        : undefined,
                    userTags: body.selectedUserTagIndexes?.length
                        ? { connect: body.selectedUserTagIndexes.map((id) => ({ id })) }
                        : undefined,
                },
            });

            return newIng;
        });

        return NextResponse.json(ingredient, { status: 201 });
    } catch (err) {
        /* --------- Prisma branch ---------- */
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            const status = mapPrismaCodeToStatus(err.code);
            return NextResponse.json(
                {
                    error: 'PRISMA_ERROR',
                    code: err.code,                 // e.g. P2002
                    message: humanMessage(err.code, 'ingredient') // e.g. “That name is already taken.”
                },
                { status }
            );
        }

        /* --------- Generic branch --------- */
        console.error('[ingredient POST]', err);
        return NextResponse.json(
            { error: 'UNKNOWN_ERROR', message: 'Failed to create ingredient' },
            { status: 500 }
        );
    }
}
