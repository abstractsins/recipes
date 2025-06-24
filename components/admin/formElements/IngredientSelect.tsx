import { useFetchIngredients } from "@/hooks/useFetchIngredients";
import { Ingredient } from "@/types/types";
import styles from './Select.module.css';

interface Props {
    data: Ingredient[] | undefined;
    ready: boolean;
    value: any;
    onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function IngredientSelect({ data, value, ready, onSelect }: Props) {

    return (
        <select value={value} disabled={!ready} className={styles["admin-select"]} name="ingredient" onChange={onSelect}>
            <option value="null" label="Select Ingredient"></option>
            {data?.sort((a, b) => a.id - b.id).map((el: Ingredient) => (
                <option key={el.id}>{`[${el.id}] - ${el.name}`}</option>
            ))}
        </select>
    );
}