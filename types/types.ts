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
    seasons?: string[],
    recipes?: Recipe[],
    notes?: string,
    user?: User,
    category?: string,
    subcategory?: string,
    defaultTags: Tag[],
    userTags: Tag[],
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

export interface AdminModule {
    className: string;
    active: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface AdminSelectProps {
    name: string;
    options?: TagOption[];
    className?: string;
    required?: boolean;
    defaultValue?: string | string[];
    multiple?: boolean;
    disabled?: boolean;
    id?: string;
    onChange: (value: string, checked: boolean) => void;
}

export type Mode = 'add' | 'edit';

export type TagOption = {
    id?: number;
    name?: string;
    label: string;
    value: string;
}
export type IngredientFormState = {
    name: string;
    main: string;
    variety: string;
    category: string;
    subcategory: string;
    seasons: string[];
    defaultTags: string[];
    userTags: string[];
};