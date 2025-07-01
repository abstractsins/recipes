import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const [defaultTags, userTags] = await Promise.all([
            prisma.defaultTag.findMany(),
            prisma.userTag.findMany()
        ]);

        return NextResponse.json({ defaultTags, userTags });

    } catch (err) {
        console.error('Error fetching tags:', err);
        return new NextResponse('Server error getting tags', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, type, createdBy } = body;

        let newTag;

        if (createdBy) {
            newTag = await prisma.userTag.create({
                data: {
                    name,
                    type,
                    createdBy
                },
            });
        } else {
            newTag = await prisma.defaultTag.create({
                data: {
                    name,
                    type
                },
            });
        }

        return NextResponse.json(newTag, { status: 201 });

    } catch (err) {
        console.error('Error creating tag:', err);
        return new NextResponse('Server error creating tag', { status: 500 });
    }
}
