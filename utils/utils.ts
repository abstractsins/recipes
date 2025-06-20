import { SeasonOption, Tag, TagOption } from "@/types/types";


export const toTitleCase = (text: string | undefined) => {
    if (text !== undefined) {
        return text.replace(/\b\w/g, (char) => char.toUpperCase())
    } else {
        return '';
    }
}

export const stripSpecialChars = (text: string) => {
    return text.replace(/[-.,;:/*+%$#@^&\\]/g, ' ');
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

export const seasonOptions = [
    { name: 'fall', value: 'fall', label: 'Fall' },
    { name: 'winter', value: 'winter', label: 'Winter' },
    { name: 'spring', value: 'spring', label: 'Spring' },
    { name: 'summer', value: 'summer', label: 'Summer' }
]
