import styles from './RecipeIngredientSelect.module.css';

import CreatableSelect from 'react-select/creatable';
import { debounce } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
import { RecipeIngredientSelectorProps, RecipeIngredientOption, Ingredient } from '@/types/types';
import { useDashboard } from '@/context/DashboardContext';

export default function RecipeIngredientSelector({ userId, onIngredientChosen }: RecipeIngredientSelectorProps) {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<RecipeIngredientOption[]>([]);

    const { refreshIngredientModule } = useDashboard();

    // Debounced DB fetch
    const fetchOptions = useCallback(
        debounce(async (value: string) => {
            const res = await fetch(`/api/ingredient/user/${userId}?query=${value}`);
            const data: Ingredient[] = await res.json();
            setOptions(data.map(ing => ({ value: ing.id, label: ing.name })));
        }, 300),
        [userId]
    );

    useEffect(() => {
        if (inputValue.trim()) {
            fetchOptions(inputValue);
        } else {
            setOptions([]);
        }
    }, [inputValue, fetchOptions]);

    const handleChange = async (selected: RecipeIngredientOption | null) => {
        if (!selected) return;

        if (selected.__isNew__) {
            //! User typed a new ingredient — create it AFTER SUBMIT THO
            const res = await fetch('/api/ingredient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: selected.label, userId }),
            });

            const newIngredient = await res.json();
            onIngredientChosen(newIngredient); // pass back full object
            refreshIngredientModule();
        } else {
            onIngredientChosen({ value: selected.value, label: selected.label });
        }
    };

    return (
        <CreatableSelect
            isClearable
            inputValue={inputValue}
            onInputChange={setInputValue}
            onChange={handleChange}
            options={options}
            classNamePrefix={'recipe-ingredient-select'}
            placeholder="Add ingredient..."
        />
    );
}
