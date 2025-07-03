import { Recipe } from "@/types/types";
import styles from './AdminSelect.module.css';
import Select from 'react-select';


type RecipeOption = {
    value: number | null;
    label: string;
};

interface Props {
    data: Recipe[] | undefined;
    ready: boolean;
    value: any;
    onSelect: (value: number | null) => void;
}

export default function RecipeSelect({ data, value, ready, onSelect }: Props) {

    const handleSelect = (selectedOption: RecipeOption | null) => {
        if (onSelect) {
            onSelect(selectedOption?.value || null);
        }
    }

    // <option value="null" label="Select Recipe"></option>
    const recipeOptions = data?.sort((a, b) => a.id - b.id).map((el: Recipe) => {
        return {
            value: el.id,
            label: `[${el.id}] - ${el.name}`
        }
    })

    return (
        <Select<RecipeOption>
            onChange={handleSelect}
            className={styles["admin-select"]}
            classNamePrefix={'add-edit-recipe'}
            name="recipe"
            value={recipeOptions?.find(opt => opt.value === value) || null}
            isDisabled={!ready}
            options={recipeOptions}
            isClearable
        />
    );
}
