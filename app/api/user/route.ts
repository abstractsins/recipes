// app/api/user/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        return new NextResponse('Server error', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();

        const { email, password, nickname } = body;

        const newUser = await prisma.user.create({
            data: {
                email,
                password, // In real apps, hash this
                nickname,
                lastLogin: new Date(),
            },
        });

        return NextResponse.json(newUser, { status: 201 });

    } catch (err) {
        console.error('Error creating user:', err);
        return new NextResponse('Server error', { status: 500 });
    }
}