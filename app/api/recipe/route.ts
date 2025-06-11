// app/api/recipe/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//********** */
//* GET      */
//********** */
export async function GET() {
    try {
        const recipes = await prisma.recipe.findMany({
            include: {
                user: true,
                tags: true,
                ingredients: {
                    include: {
                        ingredient: true
                    }
                }
            }
        });
        return NextResponse.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        return new NextResponse('Server error getting recipes', { status: 500 });
    }
}

//********** */
//* POST     */
//********** */
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

//********** */
//* PUT      */
//********** */
export async function PUT(req: NextRequest) {
    try {

        const { id, name, ingredients } = await req.json();

        const numericId = Number(id)
        if (Number.isNaN(numericId)) {
            return new NextResponse('Invalid ingredient ID; must be a number.', { status: 400 });
        }

        // 1️⃣ Update the recipe name if needed
        await prisma.recipe.update({
            where: { id: numericId },
            data: { name },
        });

        // 2️⃣ Clear existing RecipeIngredient records for this recipe
        await prisma.recipeIngredient.deleteMany({
            where: { recipeId: numericId },
        });

        // 3️⃣ Insert new RecipeIngredient records
        await prisma.recipeIngredient.createMany({
            data: ingredients.map((ing: any) => ({
                recipeId: numericId,
                ingredientId: Number(ing.ingredientId),
                quantity: ing.quantity,
                unit: ing.unit,
                prepMethod: ing.prepMethod,
            })),
        });

        return NextResponse.json({ message: "Recipe updated." });
    } catch (err) {
        console.error('Error editing recipe:', err);
        return new NextResponse('Server error editing recipe', { status: 500 });

    }
}