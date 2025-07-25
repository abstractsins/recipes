// ***********
// * IMPORTS * 
// ***********

import {
    Season,
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

//* INPUT HANDLER */
export function createInputHandler(
    setValue: (val: string) => void
) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    };
}


//* GENERAL STRING MANIPULATION */
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

export const isPrintableAsciiOnly = (text: string): boolean => /^[\x20-\x7E]+$/.test(text);



//* FETCHED DATA => UI ELEMENT CONVERSION */
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


//* STANDARD DATA */
export const seasonOptions: SeasonOption[] = [
    { id: 1, value: 'fall', label: 'Fall' },
    { id: 2, value: 'winter', label: 'Winter' },
    { id: 3, value: 'spring', label: 'Spring' },
    { id: 4, value: 'summer', label: 'Summer' }
]


//* API */
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


//* ERROR HANDLING */
export function mapPrismaCodeToStatus(code: string): number {
    switch (code) {
        case 'P2002':            // unique-constraint failed
            return 409;            // Conflict
        case 'P2003':            // FK constraint failed
            return 400;            // Bad Request
        // add the ones you care about …
        default:
            return 400;
    }
}
export function humanMessage(code: string, element: string): string {

    const vowels = 'aeiou'.split('');
    let editedEl;

    if (vowels.includes(element[0])) {
        editedEl = 'an ' + element;
    } else {
        editedEl = 'a ' + element;
    }

    switch (code) {
        case 'P2002':
            return `This user already has ${editedEl} with that name.`;
        case 'P2003':
            return 'Referenced record does not exist.';
        default:
            return 'Database error.';
    }
}



//******************************* */
//* COMMON ADMIN MODULE FUNCTIONS */
//******************************* */

//* ADD/EDIT INGREDIENT or RECIPE
export function handleModeSelectFactory(
    setMode: (mode: 'edit' | 'add') => void,
    resetAll: () => void
) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        setMode(e.target.checked ? 'edit' : 'add');
        resetAll();
    };
}

// 🍁
export function handleSeasonSelect(
    setFormState: (fn: (prev: any) => any) => void
) {
    return (season: SeasonOption | null, checked: boolean) => {
        setFormState(prev => ({
            ...prev,
            selectedSeasonIndexes: checked
                ? [...prev.selectedSeasonIndexes, season?.id]
                : prev.selectedSeasonIndexes.filter((s: number) => s !== season?.id),
        }));
    };
}

// 🏷️
export function handleTagSelectFactory<T extends { id: number }>(
    setFormState: (fn: (prev: any) => any) => void,
    key: 'selectedDefaultTagIndexes' | 'selectedUserTagIndexes'
) {
    return (tag: T | null, checked: boolean) => {
        setFormState(prev => ({
            ...prev,
            [key]: checked
                ? [...prev[key], tag?.id]
                : prev[key].filter((id: number) => id !== tag?.id),
        }));
    };
}