'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { TagType } from '@prisma/client';
import { useFetchTags } from '@/hooks/useFetchTags';

import { useFetchRecipes } from '@/hooks/useFetchRecipes';
import { useFetchUsers } from '@/hooks/useFetchUsers';
import { useFetchIngredients } from '@/hooks/useFetchIngredients';

import {
  User,
  Ingredient,
  Tag,
  Recipe
} from '@/types/types';

interface DashboardContextValue {
  users: User[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  ingredientTags: Tag[];
  recipeTags: Tag[];
  activeModuleIds: string[];
  refreshTags: (newTags: Tag[]) => void; // optional updater
  activateModule: (e: React.MouseEvent<HTMLDivElement>) => void;
  deactivateModule: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}


export function DashboardProvider({ children }: DashboardProviderProps) {

  const { users } = useFetchUsers();
  const { ingredients } = useFetchIngredients();
  const { recipes } = useFetchRecipes();

  const { tags: ingredientTags } = useFetchTags({ type: 'ingredient', user: 0, refreshKey: null });
  const { tags: recipeTags } = useFetchTags({ type: 'recipe', user: 0, refreshKey: null });
  const { tagOptions } = useFetchTags({ type: "ingredient", user: null, refreshKey: null });

  const [tags, setTags] = useState<Tag[]>();

  const [activeModuleIds, setActiveModuleIds] = useState<string[]>([]);

  const refreshTags = (newTags: Tag[]) => setTags(newTags);


  const activateModule = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.closest('.module')?.getAttribute('id');
    let updatedActiveIds = activeModuleIds.slice();
    if (id && !activeModuleIds.includes(id)) {
      updatedActiveIds.push(id);
      setActiveModuleIds(updatedActiveIds);
    }
  }


  const deactivateModule = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.closest('.module')?.getAttribute('id');
    if (id && activeModuleIds.includes(id)) {
      let updatedActiveIds = activeModuleIds.slice();
      const iActive = activeModuleIds.indexOf(id);
      updatedActiveIds.splice(iActive, 1);
      setActiveModuleIds(updatedActiveIds);
    }
  }

console.log(ingredientTags);
console.log(recipeTags);
  const value: DashboardContextValue = {
    ingredientTags,
    recipeTags,
    refreshTags,
    activeModuleIds,
    activateModule,
    deactivateModule,
    users,
    ingredients,
    recipes,
  };


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