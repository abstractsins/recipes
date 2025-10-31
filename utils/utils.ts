// ***********
// * IMPORTS * 
// ***********

import {
    Season,
    SeasonOption,
    Tag,
    TagOption,
    SeasonSelection,
    AdminOption,
    seasonGeneralOption,
    TagOptionType,
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
            value: el.name,
            type: el.type
        }
        return option;
    });

    return options;
}


//* STANDARD DATA */


// ------------- SEASONS ------------- //
const seasons: Season[] = [
    { id: 1, name: 'fall' },
    { id: 2, name: 'winter' },
    { id: 3, name: 'spring' },
    { id: 4, name: 'summer' }
];
const seasonGeneralOptions: seasonGeneralOption[] = seasons.map(s => ({
    ...s,
    value: s.name,
    label: toTitleCase(s.name)
}));
export const ingredientSeasonOptions: SeasonOption[] = seasonGeneralOptions.map(s => ({
    ...s,
    type: 'ingredient'
}))
export const recipeSeasonOptions: SeasonOption[] = seasonGeneralOptions.map(s => ({
    ...s,
    type: 'recipe'
}))


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

// ✅ TAGS — store numeric IDs from AdminOption
export function handleTagSelectFactory(
    setFormState: (fn: (prev: any) => any) => void,
    key: 'selectedDefaultTagIds' | 'selectedUserTagIds'
) {
    return (option: AdminOption | null, checked: boolean) => {
        if (!option) return;
        const type: TagOptionType = option.type;

        // Prefer `id`, else numeric `value`, else try to coerce value to number
        const id: number = option.id;

        if (Number.isNaN(id)) return; // guard if value cannot be coerced

        setFormState(prev => {
            const list: number[] = Array.isArray(prev[key]) ? prev[key] : [];
            return {
                ...prev,
                [key]: checked
                    ? (list.includes(id) ? list : [...list, id])
                    : list.filter(x => x !== id),
            };
        });
    };
}

// 🍁 SEASONS 
export function handleSeasonSelect(
    setFormState: React.Dispatch<React.SetStateAction<any>>
) {
    return (option: SeasonOption | null, checked: boolean) => {
        if (!option) return;
        const type: TagOptionType = option.type;
        // AdminMultiSelect can pass null – bail out

        const label = option.label;

        setFormState((prev: any) => {
            const current: string[] = prev.selectedSeasons ?? [];

            const next = checked
                ? [...current, label]
                : current.filter((s) => s !== label);

            return {
                ...prev,
                selectedSeasons: next,
            };
        });
    };
}


//* arrayCompare
export function arrayCompare(
    arr1: (string | number)[],
    arr2: (string | number)[]
): { equal: boolean, reason?: string } {
    if (arr1.length !== arr2.length) {
        return { equal: false, reason: 'Arrays are of different lengths' };
    }

    arr1.sort();
    arr2.sort();

    if (typeof arr1[0] !== typeof arr2[0]) {
        return { equal: false, reason: 'Arrays are of different data types' };
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return { equal: false, reason: `arr1[${i}] !== arr2[${i}] ... ${arr1[i]} !== ${arr2[i]}` }
        }
    }
    return { equal: true }
}
