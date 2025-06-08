// app/api/ingredient/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const ingredients = await prisma.ingredient.findMany();
        return NextResponse.json(ingredients);
    } catch (err) {
        console.error('Error fetching ingredients:', err);
        return new NextResponse('Server error getting ingredients', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        const { name, userId } = body;

        const newingredient = await prisma.ingredient.create({
            data: {
                name,
                userId,
                seasons: [],
                recipes: {
                    connect: body.recipes.map((id: number) => ({ id })),
                }
            },
            include: {
                recipes: true
            },
        });

        return NextResponse.json(newingredient, { status: 201 });

    } catch (err) {
        console.error('Error creating ingredient:', err);
        return new NextResponse('Server error creating ingredient', { status: 500 });
    }
}