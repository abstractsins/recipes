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

//********** */
//* PUT      */
//********** */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ingredientId = Number(id)
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
      selectedSeasons,

      selectedDefaultTagIds,

      selectedUserTagIds,
    } = body ?? {}

    console.log(body);

    const updated = await prisma.$transaction(async (tx) => {

      const updateData: any = {}

      // Build update payload only with provided fields

      if (typeof name === 'string' && name.trim()) updateData.name = name.trim()
      if (typeof userId === 'number') updateData.userId = userId
      if (main !== undefined) updateData.main = main ?? null
      if (variety !== undefined) updateData.variety = variety ?? null
      if (category !== undefined) updateData.category = category ?? null
      if (subcategory !== undefined) updateData.subcategory = subcategory ?? null
      if (brand !== undefined) updateData.brand = brand ?? null
      if (notes !== undefined) updateData.notes = notes ?? null


      // ---------- Season Tags (implicit M2M) ----------
      if (Array.isArray(selectedSeasons)) {
        // caller provided seasons; replace the links (can be [] to clear)
        updateData.seasons = { set: selectedSeasons.map((name) => ({ name })) };
      }


      // ---------- Default Tags (implicit M2M) ----------
      const rawDefault =
        Array.isArray(selectedDefaultTagIds) ? selectedDefaultTagIds
          : undefined

      if (Array.isArray(rawDefault)) {
        const ids = [...new Set(rawDefault.map(Number).filter(n => Number.isInteger(n) && n > 0))]
        updateData.defaultTags = { set: ids.map(id => ({ id })) }
      }

      // ---------- User Tags (implicit M2M) ----------
      const rawUser =
        Array.isArray(selectedUserTagIds) ? selectedUserTagIds
          : undefined

      if (Array.isArray(rawUser)) {
        const ids = [...new Set(rawUser.map(Number).filter(n => Number.isInteger(n) && n > 0))]
        updateData.userTags = { set: ids.map(id => ({ id })) }
      }

      // No-op guard: if nothing to update, return current record
      if (Object.keys(updateData).length === 0) {
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


      if (Object.keys(updateData).length) {
        await tx.ingredient.update({
          where: { id: ingredientId },
          data: updateData,
        });
      }

      // Return the full recipe with relations
      return tx.ingredient.findUnique({
        where: { id: ingredientId },
        include: {
          seasons: true,
          recipes: {
            include: { recipe: true },
          },
          defaultTags: { include: { recipes: true } },
          userTags: { include: { owner: true } },
        },
      });

    });

    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    console.error('Error updating ingredient:', err)
    return new NextResponse('Server error updating ingredient', { status: 500 })
  }
}
