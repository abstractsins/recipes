// app/api/recipe/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SeasonOption, SeasonSelection } from '@/types/types';

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
                },
                seasons: true
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

    console.log('POST new recipe');

    try {

        const body = await req.json();
        const {
            name,
            userId,
            selectedSeasons,
            selectedDefaultTagIndexes,
            selectedUserTagIndexes
        } = body;

        console.log(body);

        console.log(selectedSeasons);

        const recipe = await prisma.$transaction(async (tx) => {

            const newRecipe = await tx.recipe.create({
                data: {
                    name,
                    userId: Number(userId),
                    //!
                    seasons: selectedSeasons?.length
                        ? { connect: selectedSeasons.map((s: SeasonOption) => ({ name: s.label })) }
                        : undefined,
                    // defaultTags: body.selectedDefaultTagIndexes,
                    // userTags: body.selectedUserTagIndexes
                },
                include: { seasons: true }
            });
            return newRecipe;
        });

        return NextResponse.json(recipe, { status: 201 });

    } catch (err) {
        console.error('Error creating recipe:', err);
        return new NextResponse('Server error creating recipe', { status: 500 });
    }
}
