import FormRow from "../FormRow"
import FieldModule from "../FieldModule"
import IngredientAdd from "./IngredientAdd"


export default function RecipeIngredientsModule() {
    return (
        <>
            <FormRow>
                <FieldModule className={`ingredients`} label="Ingredients">
                    <IngredientAdd />
                </FieldModule>
            </FormRow>
        </>
    )
}