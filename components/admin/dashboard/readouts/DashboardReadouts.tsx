import styles from './DashboardReadouts.module.css';

import DashboardReadoutModule from "./DashboardReadoutModule";

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

interface Props {
    activeIds: string[];
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}


export default function DashboardReadouts({ activeIds }: Props) {

    const {
        users,
        ingredients,
        recipes,
        ingredientTags,
        recipeTags
    } = useDashboard();


    const moduleConfigs = useMemo(() => [
        {
            id: 'users-module',
            title: 'Users',
            hookData: users,
            Component: DashboardReadoutModule,
        },
        {
            id: 'ingredients-module',
            title: 'Ingredients',
            hookData: ingredients,
            Component: DashboardReadoutModule,
        },
        {
            id: 'recipes-module',
            title: 'Recipes',
            hookData: recipes,
            Component: DashboardReadoutModule,
        },
        {
            id: 'ingredient-tags-module',
            title: 'Ingredient Tags',
            hookData: ingredientTags,
            Component: DashboardReadoutModule,
        },
        {
            id: 'recipe-tags-module',
            title: 'Recipe Tags',
            hookData: recipeTags,
            Component: DashboardReadoutModule,
        }
    ], [users, ingredients, recipes, ingredientTags, recipeTags]);


    return (
        <div className={`${styles["readouts"]} grand-module`}>
            <header>
                <h2>Data Readouts</h2>
            </header>

            <div className={styles["readout-modules"]}>

                {moduleConfigs.map(({ id, title, hookData, Component }) => (
                    <Component
                        key={id}
                        id={id}
                        title={title}
                        hookData={hookData}
                        isActive={activeIds.includes(id)}
                    />
                ))}

            </div>

        </div>
    )
}