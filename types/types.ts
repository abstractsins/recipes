// **************
// * DATA TYPES *
// **************

import { Role, TagType } from "@prisma/client"

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
    user?: User,
    seasons: Season[],
    defaultTags: IngredientTag[],
    userTags: IngredientTag[],
    createdAt?: Date,
    updatedAt?: Date
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
    brand?: string,
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

export interface RecipeIngredientOption {
    value: number;
    label: string;
    __isNew__?: boolean;
}



// ***************
// * UI ELEMENTS *
// ***************

export interface AdminAddEditModule {
    id: string;
    isActive: boolean;
    title: string;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface AdminReadoutModule {
    title: string;
    id: string;
    hookData: any;
    isActive: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface AdminMultiSelectProps {
    name: string;
    options?: TagOption[] | SeasonOption[] | UomOption[];
    className?: string;
    required?: boolean;
    isLoading?: boolean;
    defaultValue?: number[];
    multiple?: boolean;
    disabled?: boolean;
    id?: string;
    onChange: (tag: AdminOption | null, checked: boolean) => void;
}

export interface AdminDropDownSelectProps {
    name: string;
    options?: UomOption[];
    className?: string;
    required?: boolean;
    isLoading?: boolean;
    value?: string;
    defaultValue?: number;
    disabled?: boolean;
    id?: string;
    isClearable?: boolean;
    onChange: (option: UomOption | null) => void;
}

export interface AdminInputProps {
    name: string;
    placeholder?: string;
    type?: string;
    maxLength?: number;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    min?: string;
    max?: string;
    value?: string | string[] | number;
    autoComplete?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export type Mode = 'add' | 'edit';

export interface AdminOption {
    id: number;
    label: string;
    value?: string;
    name?: string;
}

export interface TagOption extends AdminOption { }

export interface SeasonOption extends AdminOption { }

export interface UomOption extends AdminOption {
    abbr: string;
    metric: boolean;
    type: 'mass' | 'volume' | 'count' | 'length' | 'other';
}

export interface UserOption {
    value: number | null;
    label: string;
};

export interface RecipeIngredientSelectorProps {
    userId: number;
    onIngredientChosen: (ingredient: RecipeIngredientOption) => void;
}

// ***************
// * FORM STATES *
// ***************

export interface UserFormState {
    email: string;
    username?: string;
    nickname?: string;
    password: string;
    confirmPassword: string;
    admin: boolean;
}

export interface UserFormStateEdit {
    email: string;
    username?: string;
    nickname?: string;
    role: Role;
}

export interface UserFormEditRoute extends UserFormStateEdit {
    password?: string;
    updatedAt: Date
}

export interface IngredientFormState {
    name: string;
    main: string;
    variety: string;
    category: string;
    brand: string;
    subcategory: string;
    selectedSeasonIndexes: number[];
    selectedDefaultTagIndexes: number[];
    selectedUserTagIndexes: number[];
};

export interface RecipeFormState {
    name: string;
    selectedSeasonIndexes: number[];
    selectedDefaultTagIndexes: number[];
    selectedUserTagIndexes: number[];
}


// ***************
// * VALIDATIONS *
// ***************

interface Valid {
    isValid: true;
}

interface Invalid {
    isValid: false;
    conditionFailed: string;
    message: string;
}

export type ValidationObj = Valid | Invalid;


// ************
// * CONTEXTS *
// ************

export interface DashboardContextValue {
    /* app data / helpers */
    users: User[];
    ingredients: Ingredient[];
    recipes: Recipe[];
    fetchUserIngredients: (userId: number) => Promise<Ingredient[]>;
    fetchUserRecipes: (userId: number) => Promise<Ingredient[]>;
    fetchIngredientById: (id: number) => Promise<Ingredient>;
    fetchRecipeById: (id: number) => Promise<Ingredient>;
    fetchUserInfo: (id: number) => Promise<UserFormStateEdit>;
    refreshIngredientModule: () => void,
    refreshRecipeModule: () => void,
    refreshUsersModule: () => void,

    /* default tags always available */
    defaultIngredientTags: Tag[];
    defaultRecipeTags: Tag[];
    defaultIngredientTagOptions: TagOption[],
    defaultRecipeTagOptions: TagOption[],

    /* Loader States */
    // userTagsWaiting?: boolean,
    ingredientListWaiting?: boolean,
    recipeListWaiting?: boolean,
    isUserInfoLoading?: boolean,
    isIngredientInfoLoading?: boolean,

    /* Admin Access for all tags at once */
    allUserIngredientTags: Tag[],
    allUserRecipeTags: Tag[],
    refreshAllTags: () => void,

    /* user-specific tags */
    // userIngredientTags: Tag[],
    // userRecipeTags: Tag[],
    selectedUserIngredientTagOptions?: TagOption[],
    selectedUserRecipeTagOptions: TagOption[],
    loadUserTags: (type: 'ingredient' | 'recipe', userId: number) => Promise<Tag[]>;

    /* UI state */
    activeModuleIds: string[];
    activateModule: (e: React.MouseEvent<HTMLDivElement>) => void;
    deactivateModule: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface loadUserTagOptions {
    silent: boolean;
}