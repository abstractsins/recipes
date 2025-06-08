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
    if (Number.isNaN(id)) {
        return new NextResponse('Invalid user ID; must be a number.', { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return new NextResponse('Ingredient not found.', { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        return new NextResponse('Server error.', { status: 500 });
    }
}
