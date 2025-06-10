import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: any  
) {
    // await the promise exactly once
    const { id } = await params
    const numericId = Number(id)
    if (Number.isNaN(numericId)) {
        return new NextResponse('Invalid tag ID; must be a number.', { status: 400 });
    }

    try {
        const tag = await prisma.tag.findUnique({ where: { id } });
        if (!tag) {
            return new NextResponse('Tag not found.', { status: 404 });
        }

        return NextResponse.json(tag);
    } catch (err) {
        console.error('Error fetching tag:', err);
        return new NextResponse('Server error.', { status: 500 });
    }
}
