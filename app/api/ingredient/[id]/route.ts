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

      await tx.ingredient.update({
        where: { id: ingredientId },
        data: updateData,
      });


      // -------- default tags (explicit M2M now) --------
      if (Array.isArray(selectedDefaultTagIds)) {
        // wipe existing joins
        await tx.ingredientDefaultTag.deleteMany({
          where: { ingredientId },
        });

        const cleanIds = [
          ...new Set(
            selectedDefaultTagIds
              .map(Number)
              .filter((n) => Number.isInteger(n) && n > 0)
          ),
        ];

        if (cleanIds.length) {
          await tx.ingredient.update({
            where: { id: ingredientId },
            data: {
              defaultTags: {
                create: cleanIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              },
            },
          });
        }
      }

      // -------- user tags (explicit M2M now) --------
      if (Array.isArray(selectedUserTagIds)) {
        // wipe existing joins
        await tx.ingredientUserTag.deleteMany({
          where: { ingredientId },
        });

        const cleanIds = [
          ...new Set(
            selectedUserTagIds
              .map(Number)
              .filter((n) => Number.isInteger(n) && n > 0)
          ),
        ];

        if (cleanIds.length) {
          await tx.ingredient.update({
            where: { id: ingredientId },
            data: {
              userTags: {
                create: cleanIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              },
            },
          });
        }
      }


      // Return the full recipe with relations
      return tx.ingredient.findUnique({
        where: { id: ingredientId },
        include: {
          seasons: true,
          recipes: {
            include: { recipe: true },
          },
          // now that tags are explicit, include through the join to get the actual tag
          defaultTags: { include: { tag: true } },
          userTags: { include: { tag: true } },
        },
      });
    });

    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    console.error('Error updating ingredient:', err)
    return new NextResponse('Server error updating ingredient', { status: 500 })
  }
}
