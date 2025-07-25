import FormRow from "../FormRow"
import FieldModule from "../FieldModule"
import IngredientAdd from "./IngredientAdd"
import { Mode } from "@/types/types"

import { FiPlusCircle } from "react-icons/fi"


interface Props {
    mode: Mode;
}

export default function RecipeIngredientsModule({ mode }: Props) {
    return (
        <>
            <FormRow>
                <FieldModule className={`ingredients`} label="Ingredients">
                    {mode === 'add' ? <IngredientAdd /> : <span><FiPlusCircle />Add Ingredient</span>}
                </FieldModule>
            </FormRow>
        </>
    )
}