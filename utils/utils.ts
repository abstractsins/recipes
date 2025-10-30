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
export const seasonOptions: SeasonOption[] = [
    { id: 1, name: 'fall', value: 'fall', label: 'Fall' },
    { id: 2, name: 'winter', value: 'winter', label: 'Winter' },
    { id: 3, name: 'spring', value: 'spring', label: 'Spring' },
    { id: 4, name: 'summer', value: 'summer', label: 'Summer' }
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
    return (opt: AdminOption | null, checked: boolean) => {
        if (!opt) return;

        // Prefer `id`, else numeric `value`, else try to coerce value to number
        const id: number = typeof opt.id === 'number'
            ? opt.id
            : typeof opt.value === 'number'
                ? opt.value
                : Number(opt.value);

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

// ✅ SEASONS — store labels from AdminOption
export function handleSeasonSelect(
    setFormState: (fn: (prev: any) => any) => void
) {
    return (opt: AdminOption | null, checked: boolean) => {
        if (!opt) return;

        const label = opt.label; // valueKey='label' in the select

        setFormState(prev => {
            console.log(prev.selectedSeasons);

            console.log(prev.selectedSeasons);

            const list: string[] = Array.isArray(prev.selectedSeasons)
                ? prev.selectedSeasons.map((s: string) => s)
                : [];

            return {
                ...prev,
                selectedSeasons: checked
                    ? (list.includes(opt.label) ? list : [...list, opt.label])
                    : list.filter(x => x !== opt.label),
            };
        });
    };
}
