import AddEditIngredient from "./AddEditIngredient"
import EditIngredient from "./EditIngredient";

interface Props {
    activeIds: string[];
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function DashboardAddEdit({ onClick: activate, close: deactivate, activeIds }: Props) {

    return (
        <div className="add-data grand-module">
            <header>
                <h2>Add or Edit Data</h2>
            </header>

            <div className="add-data-modules">

                <AddEditIngredient
                    className={`${activeIds.includes('add-edit-ingredient-module') ? 'active' : 'inactive'}`}
                    onClick={activate}
                    active={activeIds.includes('add-edit-ingredient-module')}
                    close={deactivate}
                />

            </div>

        </div>
    )
}