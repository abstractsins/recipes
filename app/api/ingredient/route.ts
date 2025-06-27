// app/api/ingredient/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Tag } from '@/types/types';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const ingredients = await prisma.ingredient.findMany({
            include: { 
                IngredientTag: true, 
                user: false, 
                seasons: true 
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
        const { 
            name, 
            userId, 
            selectedSeasonIndexes, 
            main, 
            variety, 
            category, 
            subcategory, 
            IngredientTag 
        } = body;

        const user = Number(userId.split(':')[0]);

        console.log(IngredientTag)

        const newingredient = await prisma.ingredient.create({
            data: {
                name,
                userId: user,
                seasons: {
                    create: selectedSeasonIndexes.map((seasonId: number) => ({
                        tag: { connect: { id: seasonId } }
                    }))
                },
                main,
                variety,
                category,
                subcategory,
                IngredientTag: {
                    create: IngredientTag.map((tag: Tag) => ({
                        tag: { connect: { id: tag.id } }
                    }))
                }
            },
            include: { recipes: true, IngredientTag: true },
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