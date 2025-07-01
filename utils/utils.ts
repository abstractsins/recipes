// ***********
// * IMPORTS * 
// ***********

import {
    SeasonOption,
    Tag,
    TagOption,
} from "@/types/types";

import { TagType } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";

import { prisma } from '@/lib/prisma';




// ***********
// * EXPORTS * 
// ***********

// 'to title case' => 'To Title Case'
export const toTitleCase = (text: string | undefined) => {
    if (text !== undefined) {
        return text.replace(/\b\w/g, (char) => char.toUpperCase())
    } else {
        return '';
    }
}

// 'user-module' => 'user module'
export const stripSpecialChars = (text: string, exceptions?: string[]) => {
    let chars: string[] = '-.,;:/*+%$#@^&\\\\'.split('');
    if (exceptions) chars = chars.filter(char => !exceptions.includes(char));
    const charString: string = chars.join('');
    const reg = new RegExp('[' + charString + ']', 'g')
    return text.replace(reg, ' ');
}

export const tagsIntoOptions = (tags: Tag[]) => {
    const options: TagOption[] = tags?.map(el => {
        const option = {
            id: el.id,
            name: el.name,
            label: toTitleCase(el.name),
            value: el.name
        }
        return option;
    });
    
    return options;
}

export const seasonOptions: SeasonOption[] = [
    { id: 1, value: 'fall', label: 'Fall' },
    { id: 2, value: 'winter', label: 'Winter' },
    { id: 3, value: 'spring', label: 'Spring' },
    { id: 4, value: 'summer', label: 'Summer' }
]

// GET INGREDIENT/RECIPE TAGS
export async function INGREDIENT_RECIPE_TAG_GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userIdParam = searchParams.get('userId');
        const userId = userIdParam ? Number(userIdParam) : null;

        const tagType = req.nextUrl.pathname.includes('/ingredient')
            ? TagType.ingredient
            : TagType.recipe;

        /* default tags are always global */
        const defaultTagsPromise = prisma.defaultTag.findMany({
            where: { type: tagType },
            orderBy: { name: 'asc' },
        });

        /* user tags : either all, or just this user */
        const userTagsPromise = prisma.userTag.findMany({
            where: {
                type: tagType,
                ...(userId != null && { createdBy: userId }),
            },
            orderBy: { name: 'asc' },
            include: {
                owner: { select: { id: true, username: true } },
            },
        });

        const [defaultTags, userTags] = await Promise.all([
            defaultTagsPromise,
            userTagsPromise,
        ]);

        return NextResponse.json({ defaultTags, userTags });
    } catch (err) {
        console.error('[tag GET]', err);
        return new NextResponse('Failed to fetch tags', { status: 500 });
    }
}