import UsersModule from "./UsersModule"
import RecipesModule from "./RecipesModule"
import IngredientsModule from "./IngredientsModule"
import RecipeTagsModule from "./RecipeTagsModule"
import IngredientTagsModule from "./IngredientTagsModule"

import styles from './DashboardReadouts.module.css';

interface Props {
    activeIds: string[];
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function DashboardReadouts({ onClick: activate, close: deactivate, activeIds }: Props) {

    return (
        <div className={`${styles["readouts"]} grand-module`}>
            <header>
                <h2>Data Readouts</h2>
            </header>

            <div className={styles["readout-modules"]}>

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

                {/* ----------- RECIPE TAGS ---------- */}
                <RecipeTagsModule
                    className={`${activeIds.includes('recipe-tags-module') ? 'active' : 'inactive'}`}
                    onClick={activate}
                    active={activeIds.includes('recipe-tags-module')}
                    close={deactivate}
                />

                {/* ----------- INGREDIENT TAGS ---------- */}
                <IngredientTagsModule
                    className={`${activeIds.includes('ingredient-tags-module') ? 'active' : 'inactive'}`}
                    onClick={activate}
                    active={activeIds.includes('ingredient-tags-module')}
                    close={deactivate}
                />
            </div>

        </div>

    )
}