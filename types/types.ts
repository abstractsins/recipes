// **************
// * DATA TYPES *
// **************

export interface User {
    id: number,
    email: string | null,
    nickname: string | null,
    username: string | null,
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date
}

export interface Recipe {
    id: number,
    name: string,
    user?: User
}

export interface Ingredient {
    id: number,
    name: string
    main?: string,
    variety?: string,
    seasons: string[],
    recipes?: Recipe[],
    notes?: string,
    user?: User,
    category?: string,
    subcategory?: string,
    defaultTags: number[],
    userTags: number[],
    createdAt?: Date,
    updatedAt?: Date
}

export interface Tag {
    id: number,
    name: string,
    type: string,
    createdBy: number | null,
    createdByUser: User | null
}



// ***************
// * UI ELEMENTS *
// ***************

export interface AdminReadoutModule {
    title: string;
    id: string;
    hookData: any; 
    isActive: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface AdminSelectProps {
    name: string;
    options?: TagOption[] | SeasonOption[];
    className?: string;
    required?: boolean;
    isLoading?: boolean;
    defaultValue?: string | string[] | number[];
    multiple?: boolean;
    disabled?: boolean;
    id?: string;
    onChange: (tag: TagOption | SeasonOption | Option, checked: boolean) => void;
}

export type Mode = 'add' | 'edit';

export type TagOption = {
    id: number;
    name: string;
    label: string;
    value: string;
}

export interface SeasonOption {
    id?: number;
    name?: string;
    label: string;
    value: string;
}

export type Option = {
    id?: number;
    name?: string;
    label?: string;
    value?: string;
}



// ***************
// * FORM STATES *
// ***************

export type IngredientFormState = {
    name: string;
    main: string;
    variety: string;
    category: string;
    subcategory: string;
    seasons: string[];
    selectedDefaultTagIndexes: number[];
    selectedUserTagIndexes: number[];
};