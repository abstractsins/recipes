import { useFetchIngredients } from "@/hooks/useFetchIngredients";
import { Ingredient } from "@/types/types";

interface Props {
    data: Ingredient[] | undefined;
    ready: boolean;
    onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function IngredientSelect({ data, ready, onSelect }: Props) {

    return (
        <select disabled={ready} className="admin-select" name="ingredient" defaultValue={'Ingredient'} onChange={onSelect}>
            <option value="null" label="Select Ingredient"></option>
            {data?.sort((a,b)=>a.id - b.id).map((el: Ingredient) => (
                <option key={el.id}>{`[${el.id}] - ${el.name}`}</option>
            ))}
        </select>
    );
}