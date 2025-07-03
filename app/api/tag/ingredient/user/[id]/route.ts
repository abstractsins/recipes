import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { mapPrismaCodeToStatus, humanMessage } from '@/utils/utils';

const prisma = new PrismaClient();

//********** */
//* GET      */
//********** */
export async function GET(req: NextRequest, { params }: any) {
    try {
        const { id } = await params;

        const [userTags] = await Promise.all([
            prisma.userTag.findMany({
                where: { type: 'ingredient', createdBy: Number(id) },
                orderBy: { name: 'asc' },
            })
        ]);

        return NextResponse.json({ userTags });
    } catch (error) {
        console.error('Error fetching user ingredient tags: ', error);
        return new NextResponse('Failed to fetch user ingredient tags', { status: 500 });
    }
}

//********** */
//* POST     */
//********** */
// * Create new user ingredient tag
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
                type: 'ingredient',
                createdBy: Number(id)
            }
        });
        return NextResponse.json(tag, { status: 201 });
    } catch (err) {
        
        /* --------- Prisma branch ---------- */
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            const status = mapPrismaCodeToStatus(err.code);
            return NextResponse.json(
                {
                    error: 'PRISMA_ERROR',
                    code: err.code,                 // e.g. P2002
                    message: humanMessage(err.code, 'tag') // e.g. “That name is already taken.”
                },
                { status }
            );
        }

        /* --------- Generic branch --------- */
        console.error('[ingredient POST]', err);
        return NextResponse.json(
            { error: 'UNKNOWN_ERROR', message: 'Failed to create tag' },
            { status: 500 }
        );
    }
}
