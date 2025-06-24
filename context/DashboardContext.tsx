'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Tag, TagType } from '@prisma/client';
import { useFetchTags } from '@/hooks/useFetchTags';

interface DashboardContextValue {
  ingredientTags: Tag[];
  recipeTags: Tag[];
  activeModuleIds: string[];
  refreshTags: (newTags: Tag[]) => void; // optional updater
  activateModule: (id: string) => void;
  deactivateModule: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({children }: DashboardProviderProps) {
  const [tags, setTags] = useState<Tag[]>();
  const [activeIds, setActiveIds] = useState<string[]>([]);

  useEffect(()=>{
    const {tagOptions} = useFetchTags({type: "ingredient", user: null, refreshKey: null});
    // setTags(tags);
  }, [])

  const ingredientTags = useMemo(
    () => tags.filter((tag) => tag.type === TagType.ingredient),
    [tags]
  );

  const recipeTags = useMemo(
    () => tags.filter((tag) => tag.type === TagType.recipe),
    [tags]
  );

  const refreshTags = (newTags: Tag[]) => setTags(newTags);

  const activate = (id: string) => {
    setActiveIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const deactivate = (id: string) => {
    setActiveIds((prev) => prev.filter((i) => i !== id));
  };

  const value: DashboardContextValue = {
    ingredientTags,
    recipeTags,
    refreshTags,
    activeModuleIds: activeIds,
    activateModule: activate,
    deactivateModule: deactivate,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}


export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

