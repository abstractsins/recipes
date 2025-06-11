// app/api/tag/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const tags = await prisma.tag.findMany();
        return NextResponse.json(tags);
    } catch (err) {
        console.error('Error fetching tags:', err);
        return new NextResponse('Server error getting tags', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        const { name, type } = body;

        const newRecipe = await prisma.tag.create({
            data: {
                name,
                type
            },
        }); 

        return NextResponse.json(newRecipe, { status: 201 });

    } catch (err) {
        console.error('Error creating tag:', err);
        return new NextResponse('Server error creating tag', { status: 500 });
    }
}