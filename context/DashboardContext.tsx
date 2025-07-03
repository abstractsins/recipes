'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback
} from 'react';

import { useFetchTags } from '@/hooks/useFetchTags';
import { useFetchRecipes } from '@/hooks/useFetchRecipes';
import { useFetchUsers } from '@/hooks/useFetchUsers';
import { useFetchIngredients } from '@/hooks/useFetchIngredients';

import { tagsIntoOptions } from '@/utils/utils';

import {
  Tag,
  Ingredient,
  DashboardContextValue,
} from '@/types/types';


const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

interface DashboardProviderProps { children: ReactNode }

export function DashboardProvider({ children }: DashboardProviderProps) {

  /* —  GLOBAL REFRESHES — */
  const [tagsRefreshKey, setTagsRefreshKey] = useState(0);
  const [ingredientsRefreshKey, setIngredientsRefreshKey] = useState(0);
  const [usersRefreshKey, setUsersRefreshKey] = useState(0);
  const [recipesRefreshKey, setRecipesRefreshKey] = useState(0);

  // READOUT MODULE DATA
  const { users } = useFetchUsers({ refreshKey: usersRefreshKey });

  const { ingredients } = useFetchIngredients({ refreshKey: ingredientsRefreshKey });

  const { recipes } = useFetchRecipes({ refreshKey: recipesRefreshKey });

  const {
    defaultTags: defaultIngredientTags,
    userTags: allUserIngredientTags,
  } = useFetchTags({ type: 'ingredient', user: null, refreshKey: tagsRefreshKey });

  const {
    defaultTags: defaultRecipeTags,
    userTags: allUserRecipeTags,
  } = useFetchTags({ type: 'recipe', user: null, refreshKey: tagsRefreshKey });

  // READOUT MODULE REFRESH TRIGGERS
  const refreshUsers = useCallback(() => setUsersRefreshKey(k => k + 1), []);
  const refreshRecipeModule = useCallback(() => setRecipesRefreshKey(k => k + 1), []);
  const refreshAllTags = useCallback(() => setTagsRefreshKey(k => k + 1), []);
  const refreshIngredientModule = useCallback(() => setIngredientsRefreshKey(k => k + 1), []);



  // FETCHING INGREDIENT INFORMATION
  const [ingredientListWaiting, setIngredientListWaiting] = useState<boolean>(false);

  const fetchUserIngredients = useCallback(async (userId: number): Promise<Ingredient[]> => {
    setIngredientListWaiting(true);
    const res = await fetch(`/api/ingredient/user/${userId}`);
    const data = await res.json();
    setIngredientListWaiting(false);
    return data;
  }, []);

  const fetchIngredientById = useCallback(async (id: number): Promise<Ingredient> => {
    const res = await fetch(`/api/ingredient/${id}`);
    const data = await res.json();
    return data;
  }, []);

  // FETCHING RECIPE INFORMATION
  const [recipeListWaiting, setRecipeListWaiting] = useState<boolean>(false);

  const fetchUserRecipes = useCallback(async (userId: number): Promise<Ingredient[]> => {
    setRecipeListWaiting(true);
    const res = await fetch(`/api/recipe/user/${userId}`);
    const data = await res.json();
    setRecipeListWaiting(false);
    return data;
  }, []);

  const fetchRecipeById = useCallback(async (id: number): Promise<Ingredient> => {
    const res = await fetch(`/api/recipe/${id}`);
    const data = await res.json();
    return data;
  }, []);

  /* —  USER TAGS (lazy-loaded) — */
  const loadUserTags = useCallback(
    async (type: 'ingredient' | 'recipe', user: number): Promise<Tag[]> => {
      const res = await fetch(`/api/tag/${type}/user/${user}`);
      const { userTags } = await res.json();
      return userTags;
    },
    []
  );



  // Transform the tags into ui checkboxes
  const defaultIngredientTagOptions = useMemo(
    () => tagsIntoOptions(defaultIngredientTags ?? []),
    [defaultIngredientTags]
  );
  const defaultRecipeTagOptions = useMemo(
    () => tagsIntoOptions(defaultRecipeTags ?? []),
    [defaultRecipeTags]
  );

  const selectedUserRecipeTagOptions = useMemo(
    () => tagsIntoOptions(allUserRecipeTags ?? []),
    [allUserRecipeTags]
  );



  // MODULE activation and deactivation
  const [activeModuleIds, setActiveModuleIds] = useState<string[]>([]);

  const activateModule = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.closest('.module')?.getAttribute('id');
    let updatedActiveIds = activeModuleIds.slice();
    if (id && !activeModuleIds.includes(id)) {
      updatedActiveIds.push(id);
      setActiveModuleIds(updatedActiveIds);
    }
  };

  const deactivateModule = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.closest('.module')?.getAttribute('id');
    if (id && activeModuleIds.includes(id)) {
      let updatedActiveIds = activeModuleIds.slice();
      const iActive = activeModuleIds.indexOf(id);
      updatedActiveIds.splice(iActive, 1);
      setActiveModuleIds(updatedActiveIds);
    }
  };



  const value: DashboardContextValue = useMemo(() => ({
    /* app data / helpers */
    users,
    ingredients,
    recipes,
    fetchUserIngredients,
    fetchIngredientById,
    refreshIngredientModule,
    refreshRecipeModule,
    fetchUserRecipes,
    fetchRecipeById,

    /* default tags always available */
    defaultIngredientTags,
    defaultRecipeTags,
    defaultIngredientTagOptions,
    defaultRecipeTagOptions,

    /* Loader States */
    ingredientListWaiting,
    recipeListWaiting,

    /* Admin Access for all tags at once */
    allUserIngredientTags,
    allUserRecipeTags,
    refreshAllTags,

    /* user-specific tags */
    // userIngredientTags,
    userRecipeTags: allUserRecipeTags,
    // selectedUserIngredientTagOptions,
    selectedUserRecipeTagOptions,
    loadUserTags,

    /* UI state */
    activeModuleIds,
    activateModule,
    deactivateModule,
  }), [
    users,
    ingredients,
    recipes,
    activeModuleIds,
    defaultIngredientTags,
    defaultRecipeTags,
    allUserIngredientTags,
    allUserRecipeTags,
    defaultIngredientTagOptions,
    defaultRecipeTagOptions,
    // selectedUserIngredientTagOptions,
    selectedUserRecipeTagOptions,
    ingredientListWaiting,
    recipeListWaiting
  ]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
