import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // your Prisma client

// GET /api/tags/recipes
export async function GET() {
    const tags = await prisma.tag.findMany({
        where: { type: 'recipe' },
        orderBy: { createdBy: 'desc' },
        include: {
            createdByUser: true
        }
    });

    console.log(tags);
    console.log(JSON.stringify(tags));
    console.log(NextResponse.json(tags));
    return NextResponse.json(tags);

}

// POST /api/tags/recipes
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, createdBy } = body;

    const tag = await prisma.tag.create({
        data: {
            name,
            type: 'recipe',
        },
    });

    return NextResponse.json(tag, { status: 201 });
}
