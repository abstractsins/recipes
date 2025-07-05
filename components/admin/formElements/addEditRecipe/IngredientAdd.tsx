import styles from './IngredientAdd.module.css';
import { FiPlusCircle } from "react-icons/fi";
import FormRow from "../FormRow";

export default function IngredientAdd() {
    return (
        <>
            <input name="ingredient-name" type="text" placeholder="Add ingredient..." className="quick-input" />
            <div
                className={`${styles["plus-circle-container"]} ${styles['dark']}`}
                onClick={()=>{}}
            >
                <FiPlusCircle />
            </div>
        </>
    );
}