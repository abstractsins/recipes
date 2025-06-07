// app/api/recipe/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const recipes = await prisma.recipe.findMany();
        return NextResponse.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        return new NextResponse('Server error getting recipes', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        const { name, userId } = body;

        const newRecipe = await prisma.recipe.create({
            data: {
                name,
                userId
            },
        }); 

        return NextResponse.json(newRecipe, { status: 201 });

    } catch (err) {
        console.error('Error creating recipe:', err);
        return new NextResponse('Server error creating recipe', { status: 500 });
    }
}