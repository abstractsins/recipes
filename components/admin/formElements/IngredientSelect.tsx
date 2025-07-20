import { Ingredient } from "@/types/types";
import styles from './AdminMultiSelect.module.css';
import Select from 'react-select';


type IngredientOption = {
    value: number | null;
    label: string;
};

interface Props {
    data: Ingredient[] | null;
    ready: boolean;
    value: any;
    onSelect: (value: number | null) => void;
}

export default function IngredientSelect({ 
    data, 
    value, 
    ready, 
    onSelect 
}: Props) {

    const handleSelect = (selectedOption: IngredientOption | null) => {
        if (onSelect) {
            onSelect(selectedOption?.value || null);
        }
    }


    // <option value="null" label="Select Ingredient"></option>
    const ingredientOptions = data?.sort((a, b) => a.id - b.id).map((el: Ingredient) => {
        return {
            value: el.id,
            label: `[${el.id}] - ${el.name}`
        }
    })

    return (
        <Select<IngredientOption>
            onChange={handleSelect}
            className={styles["admin-select"]}
            classNamePrefix={'add-edit-ingredient'}
            name="ingredient"
            value={ingredientOptions?.find(opt => opt.value === value) || null}
            isDisabled={!ready}
            options={ingredientOptions}
            isClearable
        />
    );
}
