import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'
import { UserFormEditRoute } from '@/types/types';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

//*****************/
//****** GET ******/
//*****************/

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



//*****************/
//****** PUT ******/
//*****************/

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
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const updatedData: UserFormEditRoute = {
            email,
            nickname,
            username,
            role,
            updatedAt: new Date(),
        };

        if (hashedPassword !== undefined) {
            updatedData.password = hashedPassword;
        }

        const editedUser = await prisma.user.update({
            where: { id: numericId },
            data: updatedData
        });

        return NextResponse.json(editedUser, { status: 201 });

    } catch (err) {
        console.error('Error creating user:', err);
        return new NextResponse('Server error', { status: 500 });
    }
}
