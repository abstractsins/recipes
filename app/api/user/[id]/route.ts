import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id)

    if (isNaN(id)) {
        return new NextResponse("Invalid user ID. Use a number.", { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({ user })
    } catch (err) {
        console.error("Error fetching user:", err)
        return new NextResponse("Server error", { status: 500 });
    }
}
