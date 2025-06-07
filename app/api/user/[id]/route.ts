// app/api/user/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(           // ✅ 1st arg:  Web-standard Request
    _req: Request,
    { params }: { params: { id: string } }   // ✅ 2nd arg:  EXACT inline type
) {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
        return new NextResponse('Invalid user ID; must be a number.', { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return new NextResponse('User not found.', { status: 404 });

        return NextResponse.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        return new NextResponse('Server error.', { status: 500 });
    }
}
