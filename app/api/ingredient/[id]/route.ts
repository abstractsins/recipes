// api/ingredient/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient();

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
                IngredientTag: true,
                user: false,
                seasons: true
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



//********** */
//* PUT      */
//********** */
export async function PUT(req: NextRequest, { params }: any) {
    try {

        const {
            name,
            selectedSeasonIndexes,
            main,
            variety,
            category,
            subcategory,
            IngredientTag
        } = await req.json();

        const urlParams = await params;

        const numericId = Number(urlParams.id)
        if (isNaN(numericId)) {
            return new NextResponse('Invalid ingredient ID; must be a number.', { status: 400 });
        }

        await prisma.ingredient.update({
            where: { id: numericId },
            data: {
                name,
                seasons: {
                    set: selectedSeasonIndexes.map((s: number | { id: number }) =>
                        typeof s === "object" ? { id: s.id } : { id: s }
                    )
                },
                main,
                variety,
                category,
                subcategory,
                IngredientTag: {
                    deleteMany: {},
                    create: [...new Set(IngredientTag)]
                        .filter((id): id is number => typeof id === 'number')
                        .map((id) => ({
                            tag: { connect: { id } }
                        }))
                }
            }
        });

        return NextResponse.json({ message: "Ingredient updated." });
    } catch (err: any) {

        console.error('Error editing ingredient:', err);
        return new NextResponse(JSON.stringify({ error: 'Server error editing recipe' }), { status: 500 });
    }
}