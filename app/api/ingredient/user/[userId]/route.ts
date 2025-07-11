import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const userId = Number(params.userId);
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('query') || '';

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const ingredients = await prisma.ingredient.findMany({
            where: {
                userId,
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            orderBy: { name: 'asc' },
            take: 15, // optional limit
        });

        return NextResponse.json(ingredients);
    } catch (err) {
        console.error('Error fetching user ingredients:', err);
        return new NextResponse('Server error getting user ingredients', { status: 500 });
    }
}
