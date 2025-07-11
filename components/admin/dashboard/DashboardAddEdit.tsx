import styles from './DashboardAddEdit.module.css';

import AddEditIngredient from "./AddEditIngredient"
import AddEditRecipe from "./AddEditRecipe";
import AddEditUser from './AddEditUser';

import { useDashboard } from "@/context/DashboardContext";


interface Props {
    activeIds: string[];
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function DashboardAddEdit({ activeIds, onClick, close }: Props) {

    const moduleConfigs = [
        {
            id: 'add-edit-user',
            title: 'User',
            Component: AddEditUser,
        },
        {
            id: 'add-edit-ingredient-module',
            title: 'Ingredient',
            Component: AddEditIngredient,
        },
        {
            id: 'add-edit-recipe-module',
            title: 'Recipe',
            Component: AddEditRecipe,
        }
    ];


    return (
        <div className={`${styles['add-data']}`}>
            <header>
                <h2>Add or Edit Data</h2>
            </header>

            <div className={`${styles["add-data-modules"]}`}>

                {moduleConfigs.map(({ id, title, Component }) => (
                    <Component
                        key={id}
                        id={id}
                        title={title}
                        isActive={activeIds.includes(id)}
                        onClick={onClick}
                        close={close}
                    />
                ))}

            </div>

        </div>
    )
}