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
    name: string
}

export interface Ingredient {
    id: number,
    name: string
    main?: string,
    variety?: string,
    seasons?: string[],
    recipes?: Recipe[],
    notes?: string

}

export interface Tag {
    id: number,
    name: string,
    type: string
}

export interface AdminModule {
    className: string;
    active: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}