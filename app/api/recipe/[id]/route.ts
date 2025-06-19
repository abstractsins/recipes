import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: any
) {
    // await the promise exactly once
    const urlParams = await params
    const numericId = Number(urlParams.id)
    if (Number.isNaN(numericId)) {
        return new NextResponse('Invalid recipe ID; must be a number.', { status: 400 });
    }

    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: numericId },
            include: { ingredients: true }

        });
        if (!recipe) {
            return new NextResponse('Recipe not found.', { status: 404 });
        }

        return NextResponse.json(recipe);
    } catch (err) {
        console.error('Error fetching recipe:', err);
        return new NextResponse('Server error.', { status: 500 });
    }
}


//********** */
//* PUT      */
//********** */
export async function PUT(req: NextRequest, { params }: any) {
    try {

        const { name, ingredients } = await req.json();
        const urlParams = await params;

        const numericId = Number(urlParams.id)
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