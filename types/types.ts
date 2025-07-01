// **************
// * DATA TYPES *
// **************

import { TagType } from "@prisma/client"

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
    seasons: Season[],
    recipes: Recipe[],
    notes?: string,
    user?: User,
    category?: string,
    subcategory?: string,
    defaultTags: IngredientTag[],
    userTags: IngredientTag[],
    createdAt?: Date,
    updatedAt?: Date
}

export interface IngredientTag {
    ingredientId: number,
    tagId: number,
    category: string
}

export interface Tag {
    id: number,
    name: string,
    type: TagType,
    createdBy?: number,
    owner?: TagOwner,
    createdAt?: Date,
    updatedAt?: Date
}

export type TagOwner = {
    id: number,
    username: string
}

export type Season = {
    id: number,
    name: string
}

export interface IngredientDTO {
    name: string;
    userId: number;
    main?: string;
    variety?: string;
    category?: string;
    subcategory?: string;
    notes?: string;
    selectedSeasonIndexes?: number[];
    selectedDefaultTagIndexes?: number[];
    selectedUserTagIndexes?: number[];
};


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
    defaultValue?: number[];
    multiple?: boolean;
    disabled?: boolean;
    id?: string;
    onChange: (tag: TagOption | SeasonOption, checked: boolean) => void;
}

export type Mode = 'add' | 'edit';

export type TagOption = {
    id: number;
    name: string;
    label: string;
    value: string;
}

export interface SeasonOption {
    id: number;
    name?: string;
    label: string;
    value: string;
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
    selectedSeasonIndexes: number[];
    selectedDefaultTagIndexes: number[];
    selectedUserTagIndexes: number[];
};




// ************
// * CONTEXTS *
// ************

export interface DashboardContextValue {
    /* app data / helpers */
    users: User[];
    ingredients: Ingredient[];
    recipes: Recipe[];
    fetchUserIngredients: (userId: number) => Promise<Ingredient[]>;
    fetchIngredientById: (id: number) => Promise<Ingredient>;
    refreshIngredientModule: () => void,

    /* default tags always available */
    defaultIngredientTags: Tag[];
    defaultRecipeTags: Tag[];
    defaultIngredientTagOptions: TagOption[],
    defaultRecipeTagOptions: TagOption[],

    /* Loader States */
    userTagsWaiting?: boolean,
    submitWaiting?: boolean;

    /* Admin Access for all tags at once */
    allUserIngredientTags: Tag[],
    allUserRecipeTags: Tag[],
    refreshAllTags: () => void,

    /* user-specific tags */
    userIngredientTags: Tag[],
    userRecipeTags: Tag[],
    selectedUserIngredientTagOptions: TagOption[],
    selectedUserRecipeTagOptions: TagOption[],
    loadUserTags: (type: string, user: number, options: loadUserTagOptions) => void;

    /* UI state */
    activeModuleIds: string[];
    activateModule: (e: React.MouseEvent<HTMLDivElement>) => void;
    deactivateModule: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface loadUserTagOptions {
    silent: boolean;
}