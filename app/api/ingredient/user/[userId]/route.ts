import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        const userId = parseInt(params.userId);

        const ingredients = await prisma.ingredient.findMany({
            where: { userId: userId }
        });

        return NextResponse.json(ingredients);
    } catch (err) {
        console.error('Error fetching user ingredients:', err);
        return new NextResponse('Server error getting user ingredients', { status: 500 });
    }
}
