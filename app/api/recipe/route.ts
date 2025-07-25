// app/api/recipe/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//* *************************************/
//* ************** GET ******************/
//* *************************************/
export async function GET() {
    try {
        const recipes = await prisma.recipe.findMany({
            include: {
                userTags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                owner: { select: { id: true, username: true } }
                            }
                        }
                    }
                },
                defaultTags: {
                    select: { tag: { select: { id: true, name: true } } }
                },
                ingredients: {
                    include: { ingredient: true }
                }
            }
        });
        return NextResponse.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        return new NextResponse('Server error getting recipes', { status: 500 });
    }
}

//* *************************************/
//* ************** POST *****************/
//* *************************************/
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            name,
            userId,
            selectedSeasonIndexes,
            selectedDefaultTagIndexes,
            selectedUserTagIndexes
        } = body;

        console.log(body);

        console.log(body.selectedSeasonIndexes?.map((id: number) => { return { id } }));

        const newRecipe = await prisma.recipe.create({
            data: {
                name,
                userId: Number(userId),
                //!
                // seasons: body.selectedSeasonIndexes?.map((id: number) => { return { id } }) ?? undefined,
                // defaultTags: body.selectedDefaultTagIndexes,
                // userTags: body.selectedUserTagIndexes
            },
        });

        return NextResponse.json(newRecipe, { status: 201 });

    } catch (err) {
        console.error('Error creating recipe:', err);
        return new NextResponse('Server error creating recipe', { status: 500 });
    }
}
