import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        const urlParams = await params;
        const userId = parseInt(urlParams.userId);

        const recipes = await prisma.recipe.findMany({
            where: { userId: userId }
        });

        return NextResponse.json(recipes);
    } catch (err) {
        console.error('Error fetching user recipes:', err);
        return new NextResponse('Server error getting user recipes', { status: 500 });
    }
}
