// ***********
// * IMPORTS * 
// ***********

import {
    SeasonOption,
    Tag,
    TagOption
} from "@/types/types";



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

export const seasonsIntoOptions = (seasons: string[]) => {
    const options: SeasonOption[] = seasons?.map(el => {
        const option = {
            name: el,
            label: toTitleCase(el),
            value: el
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
