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
// app/api/ingredient/[id]/route.ts
export async function PUT(
  req: NextRequest,
  { params }: { params: IngredientDTO }
) {
  console.log(params);
  try {
    const ingredientId = Number(params.id)
    if (!Number.isInteger(ingredientId)) {
      return new NextResponse('Invalid ingredient id', { status: 400 })
    }

    const body = await req.json()
    const {
      name,
      userId,
      main,
      variety,
      category,
      subcategory,
      brand,
      notes,

      // allow multiple client keys
      seasonIds,
      selectedSeasonIndexes,
      selectedSeasons,

      defaultTagIds,
      selectedDefaultTagIndexes,

      userTagIds,
      selectedUserTagIndexes,
    } = body ?? {}

    // Build update payload only with provided fields
    const data: any = {}

    if (typeof name === 'string' && name.trim()) data.name = name.trim()
    if (typeof userId === 'number') data.userId = userId
    if (main !== undefined)        data.main = main ?? null
    if (variety !== undefined)     data.variety = variety ?? null
    if (category !== undefined)    data.category = category ?? null
    if (subcategory !== undefined) data.subcategory = subcategory ?? null
    if (brand !== undefined)       data.brand = brand ?? null
    if (notes !== undefined)       data.notes = notes ?? null

    // ---------- Seasons (implicit M2M) ----------
    // Only touch if the client sent a seasons array
    const rawSeasons =
      Array.isArray(seasonIds) ? seasonIds
      : Array.isArray(selectedSeasons) ? selectedSeasons
      : Array.isArray(selectedSeasonIndexes) ? selectedSeasonIndexes
      : undefined

    if (Array.isArray(rawSeasons)) {
      const seasonSet: number[] = [...new Set(
        rawSeasons.map((v: unknown) => Number(v)).filter((n) => Number.isInteger(n) && n > 0)
      )]

      // (optional) verify season ids exist
      if (seasonSet.length) {
        const found = await prisma.season.findMany({
          where: { id: { in: seasonSet } },
          select: { id: true },
        })
        const have = new Set(found.map(f => f.id))
        const missing = seasonSet.filter(id => !have.has(id))
        if (missing.length) {
          return new NextResponse(`Invalid season id(s): ${missing.join(', ')}`, { status: 400 })
        }
      }

      // Replace seasons with what the client sent (can be [] to clear)
      data.seasons = { set: seasonSet.map(id => ({ id })) }
    }

    // ---------- Default Tags (implicit M2M) ----------
    const rawDefault =
      Array.isArray(defaultTagIds) ? defaultTagIds
      : Array.isArray(selectedDefaultTagIndexes) ? selectedDefaultTagIndexes
      : undefined

    if (Array.isArray(rawDefault)) {
      const ids = [...new Set(rawDefault.map(Number).filter(n => Number.isInteger(n) && n > 0))]
      data.defaultTags = { set: ids.map(id => ({ id })) }
    }

    // ---------- User Tags (implicit M2M) ----------
    const rawUser =
      Array.isArray(userTagIds) ? userTagIds
      : Array.isArray(selectedUserTagIndexes) ? selectedUserTagIndexes
      : undefined

    if (Array.isArray(rawUser)) {
      const ids = [...new Set(rawUser.map(Number).filter(n => Number.isInteger(n) && n > 0))]
      data.userTags = { set: ids.map(id => ({ id })) }
    }

    // No-op guard: if nothing to update, return current record
    if (Object.keys(data).length === 0) {
      const current = await prisma.ingredient.findUnique({
        where: { id: ingredientId },
        include: {
          seasons: true,
          defaultTags: true,
          userTags: true,
          recipes: true,
        },
      })
      return NextResponse.json(current, { status: 200 })
    }

    const updated = await prisma.ingredient.update({
      where: { id: ingredientId },
      data,
      include: {
        seasons: true,
        defaultTags: true,
        userTags: true,
        recipes: true,
      },
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    console.error('Error updating ingredient:', err)
    return new NextResponse('Server error updating ingredient', { status: 500 })
  }
}
