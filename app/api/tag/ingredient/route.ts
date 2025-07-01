import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TagType } from '@prisma/client';
import { INGREDIENT_RECIPE_TAG_GET as GET } from '@/utils/utils';

// GET /api/tags/ingredients
export { INGREDIENT_RECIPE_TAG_GET as GET } from '@/utils/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, createdBy } = body;

    if (!name) {
      return new NextResponse('Tag name is required', { status: 400 });
    }

    let newTag;

    if (createdBy) {
      newTag = await prisma.userTag.create({
        data: {
          name,
          type: 'ingredient',
          createdBy,
        },
      });
    } else {
      newTag = await prisma.defaultTag.create({
        data: {
          name,
          type: 'ingredient',
        },
      });
    }

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Error creating ingredient tag:', error);
    return new NextResponse('Failed to create tag', { status: 500 });
  }
}
