// app/api/ingredient/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const ingredients = await prisma.ingredient.findMany({
            include: {
                user: true
            }
        });
        return NextResponse.json(ingredients);
    } catch (err) {
        console.error('Error fetching ingredients:', err);
        return new NextResponse('Server error getting ingredients', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        const { name, userId, seasons } = body;

        const user = Number(userId.split(':')[0]);

        const newingredient = await prisma.ingredient.create({
            data: {
                name,
                userId: user,
                seasons,
                // recipes: {
                //     connect: body.recipes.map((id: number) => ({ id })),
                // }
            },
            include: {
                recipes: true
            },
        });

        return NextResponse.json(newingredient, { status: 201 });

    } catch (err: any) {

        if (err.code === 'P2002') {
            return new Response(JSON.stringify({ error: 'An ingredient with that name already exists for this user' }), {
                status: 409, // Conflict
            });
        }

        console.error('Error creating ingredient:', err);
        return new NextResponse('Server error creating ingredient', { status: 500 });
    }
}