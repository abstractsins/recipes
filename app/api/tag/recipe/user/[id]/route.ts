import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // your Prisma client

export async function GET(req: NextRequest, { params }: any) {
    try {
        const { id } = await params;

        const [userTags] = await Promise.all([
            prisma.userTag.findMany({
                where: { type: 'recipe', createdBy: Number(id) },
                orderBy: { name: 'asc' },
            })
        ]);

        return NextResponse.json({ userTags });
    } catch (error) {
        console.error('Error fetching user recipe tags: ', error);
        return new NextResponse('Failed to fetch user recipe tags', { status: 500 });
    }
}

// * Create new user recipe tag
export async function POST(req: NextRequest, { params }: any) {
    try {
        const { id } = await params || null;
        console.log(id);
        
        const body = await req.json();
        const { tagName } = body;
        console.log(tagName);

        const tag = await prisma.userTag.create({
            data: {
                name: tagName,
                type: 'recipe',
                createdBy: Number(id)
            }
        });
        return NextResponse.json(tag, { status: 201 });
    } catch (error) {
        console.error('Error posting user recipe tag:', error);
        return new NextResponse('Failed to post user recipe tag', { status: 500 });
    }
}
