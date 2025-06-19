import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // your Prisma client

export async function GET(req: NextRequest, { params }: any) {
    const { id } = await params;
    const numericId = Number(id);
    console.log('params: ' + numericId);
    const tags = await prisma.tag.findMany({
        where: { type: 'ingredient', createdBy: numericId || null },
        orderBy: { name: 'asc' },
        include: { createdByUser: true }
    });

    console.log(tags);

    return NextResponse.json(tags);
}

// * Create new user ingredient tag
export async function POST(req: NextRequest, { params }: any) {
    const { id } = await params || null;
    
    const body = await req.json();
    const { tagName } = body;

    const tag = await prisma.tag.create({
        data: {
            name: tagName,
            type: 'ingredient',
            createdBy: Number(id)
        },
    });

    return NextResponse.json(tag, { status: 201 });
}
