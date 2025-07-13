import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: any
) {
    // await the promise exactly once
    const { id } = await params
    const numericId = Number(id)
    if (Number.isNaN(numericId)) {
        return new NextResponse('Invalid user ID; must be a number.', { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: numericId } });
        if (!user) {
            return new NextResponse('Ingredient not found.', { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        return new NextResponse('Server error.', { status: 500 });
    }
}


export async function PUT(
    req: NextRequest,
    { params }: any
) {
    // await the promise exactly once
    const { id } = await params
    const numericId = Number(id)
    if (Number.isNaN(numericId)) {
        return new NextResponse('Invalid user ID; must be a number.', { status: 400 });
    }

    try {

        const body = await req.json();

        const { email, password, nickname, username, admin } = body;

        const role = admin ? 'admin' : 'user';

        const hashedPassword = await bcrypt.hash(password, 10);

        const editedUser = await prisma.user.update({
            where: { id: numericId }, 
            data: {
                email,
                password: hashedPassword,
                nickname,
                username,
                role,
                lastLogin: new Date(),
            },
        });

        return NextResponse.json(editedUser, { status: 201 });

    } catch (err) {
        console.error('Error creating user:', err);
        return new NextResponse('Server error', { status: 500 });
    }
}
