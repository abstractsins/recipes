import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { mapPrismaCodeToStatus, humanMessage } from '@/utils/utils';

const prisma = new PrismaClient();

//********** */
//* GET      */
//********** */
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

//********** */
//* POST     */
//********** */
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
        console.error('>>>>>%>%>%>%>%>%>%%>%>%> ERRORR');
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
