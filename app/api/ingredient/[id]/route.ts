// api/ingredient/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type { IngredientDTO } from '@/types/types'

const prisma = new PrismaClient()

type IdCtx = { params: Promise<{ id: string }> }    // <- promise

/* ─────────────── GET ─────────────── */
export async function GET(
  _req: NextRequest,
  { params }: IdCtx
) {
  const { id } = await params;
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    return new NextResponse('Invalid ingredient ID; must be a number.', { status: 400, });
  }

  const ingredient = await prisma.ingredient.findUnique({
    where: { id: numericId },
    include: {
      seasons: true,
      defaultTags: true,
      recipes: true,
      userTags: true
    },
  })

  console.dir(ingredient);

  return ingredient
    ? NextResponse.json(ingredient)
    : new NextResponse('Ingredient not found.', { status: 404 });
}

/* ─────────────── PUT ─────────────── */
// api/ingredient/[id]/route.ts  (PUT)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ingredientId = Number(id);
  if (Number.isNaN(ingredientId)) {
    return new NextResponse('Invalid ingredient id', { status: 400 });
  }

  const body = await req.json() as IngredientDTO;
  if (!body?.name || !body?.userId) {
    return new NextResponse('name and userId are required', { status: 400 });
  }

  // normalize arrays to id objects
  const seasonIds = Array.isArray(body.selectedSeasons) ? body.selectedSeasons : [];
  const seasonSet = [...new Set(seasonIds.map(Number).filter(n => Number.isInteger(n) && n > 0))];

  const defaultTagIds = Array.isArray(body.selectedDefaultTagIndexes) ? body.selectedDefaultTagIndexes : [];
  const userTagIds = Array.isArray(body.selectedUserTagIndexes) ? body.selectedUserTagIndexes : [];

  const updated = await prisma.ingredient.update({
    where: { id: ingredientId },
    data: {
      name: body.name,
      userId: body.userId,
      main: body.main ?? null,
      variety: body.variety ?? null,
      category: body.category ?? null,
      subcategory: body.subcategory ?? null,
      brand: body.brand ?? null,
      notes: body.notes ?? null,

      // IMPORTANT: set expects identifier objects, not raw numbers
      seasons: { set: seasonSet.map(id => ({ id })) },
      defaultTags: { set: defaultTagIds.map(id => ({ id })) },
      userTags: { set: userTagIds.map(id => ({ id })) },

      updatedAt: new Date(),
    },
    include: {
      seasons: true,
      defaultTags: true,
      userTags: true,
      recipes: true,
    },
  });

  return NextResponse.json(updated, { status: 200 });
}
