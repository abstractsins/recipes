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
    defaultTags: RecipeTag[],
    userTags: RecipeTag[],
    createdAt?: Date,
    updatedAt?: Date
}

export interface Ingredient {
    id: number,
    name: string
    main?: string,
    variety?: string,
    category?: string,
    subcategory?: string,
    brand?: string,
    notes?: string,
    seasons: Season[],
    userTags: IngredientTag[],
    defaultTags: IngredientTag[],
    user?: User,
    recipes: Recipe[],
    createdAt?: Date,
    updatedAt?: Date
}

export interface IngredientTag {
    tagId: number,
    ingredientId: number,
    category: string
}

export interface RecipeTag {
    tagId: number,
    recipeId: number,
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
    brand?: string;
    notes?: string;
    selectedSeasons?: string[];
    selectedDefaultTagIds?: number[];
    selectedUserTagIds?: number[];
};

export interface RecipeDTO {
    name: string;
    userId: number;
    ingredients?: Ingredient[];
    main?: string;
    variety?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    notes?: string;
    selectedSeasons?: string[];
    selectedDefaultTagIds?: number[];
    selectedUserTagIds?: number[];
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
    isLoading: boolean;
    isActive: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface AdminMultiSelectProps {
    name: string;
    options?: TagOption[] | SeasonOption[];
    className?: string;
    required?: boolean;
    isLoading?: boolean;
    defaultValue?: (number | string)[];
    multiple?: boolean;
    disabled?: boolean;
    id?: string;
    onChange: (
        tag: AdminOption | SeasonOption | null,
        checked: boolean,
        type?: string | 'recipe' | 'ingredient' | 'other'
    ) => void;
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

//* ---------- OPTION INPUTS ---------- //
export type TagOptionType = 'recipe' | 'ingredient' | 'other';

export interface AdminOption {
    id: number;
    label: string;
    value?: string;
    name?: string;
    type: TagOptionType;
}

export interface TagOption extends AdminOption { }

export interface seasonGeneralOption extends Season {
    value: string;
    label: string;
}

export interface SeasonOption extends AdminOption {}

export interface UomOption {
    id: number;
    label: string;
    abbr: string;
    metric: boolean;
    type: 'mass' | 'volume' | 'count' | 'length' | 'other';
}

export interface UserOption {
    value: number;
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

export interface TagFormState {
    value: string;
    // type: 'ingredient' | 'recipe' | null;
    isIngredient: boolean;
    isDefaultTag: boolean;
    selectedTagAuthor?: number | null;
    selectedTagUser?: number | null;
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
    main?: string;
    variety?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    notes?: string;
    selectedSeasons: string[];
    selectedDefaultTagIds: number[];
    selectedUserTagIds: number[];
};

export interface RecipeFormState {
    name: string;
    selectedSeasons: string[];
    selectedDefaultTagIds: number[];
    selectedUserTagIds: number[];
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
    fetchUserRecipes: (userId: number) => Promise<Recipe[]>;
    fetchIngredientById: (id: number) => Promise<Ingredient>;
    fetchRecipeById: (id: number) => Promise<Recipe>;
    fetchUserUserInfo: (id: number) => Promise<UserFormStateEdit>;
    refreshIngredientModule: () => void,
    refreshRecipeModule: () => void,
    refreshUsersModule: () => void,

    /* default tags always available */
    defaultIngredientTags: Tag[];
    defaultRecipeTags: Tag[];
    defaultIngredientTagOptions: TagOption[],
    defaultRecipeTagOptions: TagOption[],

    /* Loader States */
    // add/edit loading states
    // userTagsWaiting?: boolean,
    ingredientListWaiting?: boolean,
    recipeListWaiting?: boolean,
    isUserUserInfoLoading?: boolean,
    setIngredientInfoLoading?: (b: boolean) => void;
    isIngredientInfoLoading?: boolean,

    // readout loading states
    usersLoading: boolean,
    ingredientsLoading: boolean,
    recipesLoading: boolean,
    ingredientTagsLoading: boolean,
    recipeTagsLoading: boolean,

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
    setActiveModuleIds: (ids: string[]) => void;
    activeModuleIds: string[];
    activateModule: (e: React.MouseEvent<HTMLDivElement>) => void;
    deactivateModule: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface loadUserTagOptions {
    silent: boolean;
}