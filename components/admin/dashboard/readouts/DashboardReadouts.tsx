import styles from './DashboardReadouts.module.css';

import DashboardReadoutModule from "./DashboardReadoutModule";

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

interface Props {
    activeIds: string[];
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}


export default function DashboardReadouts({ activeIds, onClick, close }: Props) {

    const {
        users,
        ingredients,
        recipes,
        defaultIngredientTags,
        defaultRecipeTags,
        allUserIngredientTags,
        allUserRecipeTags,
        activateModule,
        deactivateModule
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
            id: 'default-ingredient-tags-module',
            title: 'Default Ingredient Tags',
            hookData: defaultIngredientTags,
            Component: DashboardReadoutModule,
        },
        {
            id: 'default-recipe-tags-module',
            title: 'Default Recipe Tags',
            hookData: defaultRecipeTags,
            Component: DashboardReadoutModule,
        },
        {
            id: 'user-ingredient-tags-module',
            title: 'User Ingredient Tags',
            hookData: allUserIngredientTags,
            Component: DashboardReadoutModule,
        },
        {
            id: 'user-recipe-tags-module',
            title: 'User Recipe Tags',
            hookData: allUserRecipeTags,
            Component: DashboardReadoutModule,
        }
    ], [users, ingredients, recipes, defaultIngredientTags, defaultRecipeTags]);


    return (
        <div className={`${styles["readouts"]} ${styles['grand-module']}`}>
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
                        onClick={activateModule}
                        close={deactivateModule}
                    />
                ))}

            </div>

        </div>
    )
}