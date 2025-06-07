'use client';

import { useState } from "react";

import UsersModule from "@/components/admin/UsersModule";
import RecipesModule from "@/components/admin/RecipesModule";
import IngredientsModule from "@/components/admin/IngredientsModule";

export default function Home() {

  const [activeIds, setActiveIds] = useState<string[]>([]);

  const activate = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.closest('.module')?.getAttribute('id');
    let updatedActiveIds = activeIds.slice();
    console.log(id);
    if (id && !activeIds.includes(id)) {
      updatedActiveIds.push(id);
      setActiveIds(updatedActiveIds);
    }
  }

  const deactivate = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.closest('.module')?.getAttribute('id');
    if (id && activeIds.includes(id)) {
      let updatedActiveIds = activeIds.slice();
      const iActive = activeIds.indexOf(id);
      updatedActiveIds.splice(iActive, 1);
      setActiveIds(updatedActiveIds);
    }
  }

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Recipe Database Admin Dashboard</h1>
      </header>

      <div className="body">

        {/* ---------- USERS ---------- */}

        <UsersModule
          className={`${activeIds.includes('users-module') ? 'active' : 'inactive'}`}
          onClick={activate}
          active={activeIds.includes('users-module')}
          close={deactivate}
        />

        {/* --------- RECIPES --------- */}
        <RecipesModule
          className={`${activeIds.includes('recipes-module') ? 'active' : 'inactive'}`}
          onClick={activate}
          active={activeIds.includes('recipes-module')}
          close={deactivate}
        />

        {/* ------- INGREDIENTS ------- */}
        <IngredientsModule
          className={`${activeIds.includes('ingredients-module') ? 'active' : 'inactive'}`}
          onClick={activate}
          active={activeIds.includes('ingredients-module')}
          close={deactivate}
        />

      </div>

    </div>
  );
}
