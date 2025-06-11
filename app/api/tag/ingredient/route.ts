import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // your Prisma client

// GET /api/tags/recipes
export async function GET() {
    const tags = await prisma.tag.findMany({
        where: { type: 'ingredient' },
        orderBy: { createdBy: 'desc' },
        include: {
            createdByUser: true
        }
    });

    return NextResponse.json(tags);
}

// POST /api/tags/recipes
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, createdBy } = body;

    const tag = await prisma.tag.create({
        data: {
            name,
            type: 'ingredient',
        },
    });

    return NextResponse.json(tag, { status: 201 });
}
