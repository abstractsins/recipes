export const toTitleCase = (text: string | undefined) => {
    if (text !== undefined) {
        return text.replace(/\b\w/g, (char) => char.toUpperCase())
    } else {
        return '';
    }
}

export const stripSpecialChars = (text: string ) => {
    return text.replace(/[-.,;:/*+%$#@^&\\]/g, ' ');
}