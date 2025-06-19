'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Tag, TagType } from '@prisma/client';

interface DashboardContextValue {
  ingredientTags: Tag[];
  recipeTags: Tag[];
  refreshTags: (newTags: Tag[]) => void; // optional updater
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

interface DashboardProviderProps {
  defaultTags: Tag[];
  children: ReactNode;
}

export function DashboardProvider({ defaultTags, children }: DashboardProviderProps) {
  const [tags, setTags] = useState<Tag[]>(defaultTags);

  const ingredientTags = useMemo(
    () => tags.filter((tag) => tag.type === TagType.ingredient),
    [tags]
  );

  const recipeTags = useMemo(
    () => tags.filter((tag) => tag.type === TagType.recipe),
    [tags]
  );

  const refreshTags = (newTags: Tag[]) => setTags(newTags);

  const value: DashboardContextValue = {
    ingredientTags,
    recipeTags,
    refreshTags,
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
