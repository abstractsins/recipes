import FormRow from "@/components/FormRow";
import Toggle from "../Toggle";

interface Props {
    active: boolean;
    mode: string;
    error: string | null | undefined;
    handleModeSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AddEditIngredientHeader({active, mode, error, handleModeSelect} : Props) {
    return (
        <>
            <FormRow id="row-1">
                <h3>Ingredient</h3>
                {active &&
                    <div className="add-edit-mode-select">
                        <h3 className={mode === 'add' ? '' : 'unselected'}>
                            Add
                        </h3>
                        <Toggle onChange={handleModeSelect} />
                        <h3 className={mode === 'edit' ? '' : 'unselected'}>
                            Edit
                        </h3>
                    </div>
                }
            </FormRow>

            <FormRow id="error-row">
                {active &&
                    <div className="error">
                        {error && <span>🍓 {error}</span>}
                    </div>
                }
            </FormRow>
        </>
    );
}