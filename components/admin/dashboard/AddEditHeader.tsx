import styles from './AddEditIngredient.module.css'

import FormRow from "@/components/admin/formElements/FormRow";
import Toggle from "../../general/Toggle";


interface Props {
    title: string;
    active: boolean;
    mode: string;
    statusMsg: string | null | undefined;
    error: string | null | undefined;
    handleModeSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export default function AddEditHeader({ title, active, mode, error, statusMsg, handleModeSelect }: Props) {
    return (
        <>
            <FormRow id="row-1">
                <h3>{title}</h3>
                {active &&
                    <div className={styles["add-edit-mode-select"]}>
                        <h3 className={mode === 'add' ? '' : styles['unselected']}>
                            Add
                        </h3>

                        <Toggle onChange={handleModeSelect} />

                        <h3 className={mode === 'edit' ? '' : styles['unselected']}>
                            Edit
                        </h3>
                    </div>
                }
            </FormRow>

            <FormRow className="status-row">

                {active && error &&
                    <div className={styles["error"]}>
                        <span>🍓 {error}</span>
                    </div>
                }

                {active && statusMsg &&
                    <div className={styles["status"]}>
                        <span>🥒 {statusMsg}</span>
                    </div>
                }

            </FormRow>

        </>
    );
}