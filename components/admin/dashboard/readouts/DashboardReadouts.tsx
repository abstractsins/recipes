//* --------------------------------------- //
//* -----------------IMPORTS--------------- //
//* --------------------------------------- //

//* STYLES
import styles from './DashboardReadouts.module.css';

//* COMPONENTS
import DashboardReadoutModule from "./DashboardReadoutModule";

//* REACT
import { useMemo } from 'react';

//* CONTEXT
import { useDashboard } from '@/context/DashboardContext';



//* --------------------------------------- //
//* ----------------INTERFACE-------------- //
//* --------------------------------------- //

interface Props {
    activeIds: string[];
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}



//* --------------------------------------- //
//* -----------------EXPORTS--------------- //
//* --------------------------------------- //

export default function DashboardReadouts({
    activeIds,
    onClick,
    close
}: Props) {


    //* -----------------STATES--------------- //

    const {
        users, ingredients, recipes,
        defaultIngredientTags, defaultRecipeTags,
        allUserIngredientTags, allUserRecipeTags,
        usersLoading, ingredientsLoading, recipesLoading,
        ingredientTagsLoading, recipeTagsLoading,
        setActiveModuleIds, activateModule, deactivateModule,
    } = useDashboard();


    //* -----------------useMemo-------------- //

    const moduleConfigs = useMemo(() => [
        {
            id: 'users-module',
            title: 'Users',
            hookData: users,
            isLoading: usersLoading,
            Component: DashboardReadoutModule,
        },
        {
            id: 'ingredients-module',
            title: 'Ingredients',
            hookData: ingredients,
            isLoading: ingredientsLoading,
            Component: DashboardReadoutModule,
        },
        {
            id: 'recipes-module',
            title: 'Recipes',
            hookData: recipes,
            isLoading: recipesLoading,
            Component: DashboardReadoutModule,
        },
        {
            id: 'default-ingredient-tags-module',
            title: 'Default Ingredient Tags',
            hookData: defaultIngredientTags,
            isLoading: ingredientTagsLoading,
            Component: DashboardReadoutModule,
        },
        {
            id: 'default-recipe-tags-module',
            title: 'Default Recipe Tags',
            hookData: defaultRecipeTags,
            isLoading: recipeTagsLoading,
            Component: DashboardReadoutModule,
        },
        {
            id: 'user-ingredient-tags-module',
            title: 'User Ingredient Tags',
            hookData: allUserIngredientTags,
            isLoading: ingredientTagsLoading,
            Component: DashboardReadoutModule,
        },
        {
            id: 'user-recipe-tags-module',
            title: 'User Recipe Tags',
            hookData: allUserRecipeTags,
            isLoading: recipeTagsLoading,
            Component: DashboardReadoutModule,
        }
    ], [users, ingredients, recipes, defaultIngredientTags, defaultRecipeTags]);


    //* -----------------RETURN--------------- //

    return (
        <div className={`${styles["readouts"]} ${styles['grand-module']}`}>
            <header>
                <h2>Data Readouts</h2>
            </header>

            <div className={styles["readout-modules"]}>

                {moduleConfigs.map(({ id, title, hookData, isLoading, Component }) => (
                    <Component
                        key={id}
                        id={id}
                        title={title}
                        hookData={hookData}
                        isLoading={isLoading}
                        isActive={activeIds.includes(id)}
                        onClick={activateModule}
                        close={deactivateModule}
                    />
                ))}

            </div>

        </div>
    )
}