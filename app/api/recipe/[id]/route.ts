import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: any  
) {
    // await the promise exactly once
    const { id } = await params
    const numericId = Number(id)
    if (Number.isNaN(numericId)) {
        return new NextResponse('Invalid recipe ID; must be a number.', { status: 400 });
    }

    try {
        const recipe = await prisma.recipe.findUnique({ where: { id } });
        if (!recipe) {
            return new NextResponse('Ingredient not found.', { status: 404 });
        }

        return NextResponse.json(recipe);
    } catch (err) {
        console.error('Error fetching recipe:', err);
        return new NextResponse('Server error.', { status: 500 });
    }
}
