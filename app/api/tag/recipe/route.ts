import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INGREDIENT_RECIPE_TAG_GET as GET } from '@/utils/utils';


// GET /api/tags/recipes
export { INGREDIENT_RECIPE_TAG_GET as GET } from '@/utils/utils';

// POST /api/tags/recipes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, createdBy } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    let tag;

    if (createdBy) {
      tag = await prisma.userTag.create({
        data: {
          name,
          type: 'recipe',
          createdBy,
        },
      });
    } else {
      tag = await prisma.defaultTag.create({
        data: {
          name,
          type: 'recipe',
        },
      });
    }

    return NextResponse.json(tag, { status: 201 });
  } catch (err) {
    console.error('Error creating recipe tag:', err);
    return new NextResponse('Failed to create recipe tag', { status: 500 });
  }
}
