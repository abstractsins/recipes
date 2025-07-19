import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId: idStr } = await params;
        const userId = Number(idStr);

        const recipes = await prisma.recipe.findMany({
            where: { userId: userId }
        });

        return NextResponse.json(recipes);
    } catch (err) {
        console.error('Error fetching user recipes:', err);
        return new NextResponse('Server error getting user recipes', { status: 500 });
    }
}
