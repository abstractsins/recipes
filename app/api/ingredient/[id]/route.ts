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
  { params }: IdCtx                                   // <- same context
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

  const updatedIngredient = await prisma.$transaction(async (tx) => {
    // … your update logic …
    return tx.ingredient.update({
      where: { id: numericId },
      data: { /* fields */ },
    })
  })

  return NextResponse.json(updatedIngredient, { status: 200 })
}
