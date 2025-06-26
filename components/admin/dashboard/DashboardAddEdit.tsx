import { useDashboard } from "@/context/DashboardContext";
import AddEditIngredient from "./AddEditIngredient"
import styles from './DashboardAddEdit.module.css';


export default function DashboardAddEdit() {

    const {
        activateModule,
        deactivateModule,
        activeModuleIds
    } = useDashboard();


    return (
        <div className={`${styles['add-data']} ${styles['grand-module']}`}>
            <header>
                <h2>Add or Edit Data</h2>
            </header>

            <div className={`${styles["add-data-modules"]}`}>

                <AddEditIngredient
                    id={'add-edit-ingredient-module'}
                    onClick={activateModule}
                    isActive={activeModuleIds.includes('add-edit-ingredient-module')}
                    close={deactivateModule}
                />

            </div>

        </div>
    )
}