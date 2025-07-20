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
  const { id } = await params                      // <- await
  const numericId = Number(id)
  if (Number.isNaN(numericId)) {
    return new NextResponse('Invalid ingredient ID; must be a number.', {
      status: 400,
    })
  }

  const ingredient = await prisma.ingredient.findUnique({
    where: { id: numericId },
    include: { seasons: true, defaultTags: true, userTags: true },
  })

  return ingredient
    ? NextResponse.json(ingredient)
    : new NextResponse('Ingredient not found.', { status: 404 })
}

/* ─────────────── PUT ─────────────── */
export async function PUT(
  req: NextRequest,
  { params }: IdCtx
) {
  const { id } = await params
  const numericId = Number(id)
  if (Number.isNaN(numericId)) {
    return new NextResponse('Invalid ingredient id', { status: 400 })
  }

  const body = (await req.json()) as IngredientDTO
  if (!body?.name || !body?.userId) {
    return new NextResponse('name and userId are required', { status: 400 })
  }

  await prisma.ingredientUserTag.deleteMany({ where: { ingredientId: numericId } });
  await prisma.ingredientDefaultTag.deleteMany({ where: { ingredientId: numericId } });

  const updatedIngredient = await prisma.$transaction(async (tx) => {

    return tx.ingredient.update({
      where: { id: numericId },
      data: {
        name: body.name,
        userId: body.userId,
        main: body.main ?? null,
        variety: body.variety ?? null,
        category: body.category ?? null,
        subcategory: body.subcategory ?? null,
        brand: body.brand ?? null,
        notes: body.notes ?? null,
        seasons: { set: body.selectedSeasonIndexes?.map(id => ({ id })) ?? [] },

        // userTags: { set: body.selectedUserTagIndexes?.map(tagId => ({ tagId })) ?? [] },
        //   set: body.selectedUserTagIndexes?.map(id => ({ id })) ?? [],
        // },
        updatedAt: new Date()
      },
    })
  })

  await prisma.ingredientUserTag.createMany({
    data: body.selectedUserTagIndexes?.map(tagId => ({ ingredientId: numericId, tagId })),
    skipDuplicates: true,
  });


  return NextResponse.json(updatedIngredient, { status: 200 })
}
