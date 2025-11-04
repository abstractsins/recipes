import styles from './IngredientAdd.module.css';

import AdminInput from '../AdminInput';
import IngredientAmount from './IngredientAmount';
import FormRow from "../FormRow";
import RecipeIngredientSelector from './RecipeIngredientSelect';
import FieldModule from '../FieldModule';
import Toggle2 from '@/components/general/Toggle2';
import { useEffect, useState } from 'react';
import InputSpinner from '@/components/general/InputSpinner';
import { RecipeIngredientOption, RecipeIngredientsRecord } from '@/types/types';
import { useRecIng } from '@/context/RecipeIngredientContext';

export default function IngredientAdd() {

    const {
        recipeIngredients,
        handleRecipeIngredientAdd,
        emptyRecipeIngredientRecord
    } = useRecIng();

    const [recIngFormState, setRecIngFormState] = useState<RecipeIngredientsRecord>(emptyRecipeIngredientRecord);

    const handleIngredientNameKeypress = (ing: RecipeIngredientOption): void => {
        setIngredientAddValid(ing ? true : false);
        setRecIngFormState({ ...recIngFormState, ingredientId: ing ? ing.value : null });
    };

    const handleSearchCleared = (): void => {
        setIngredientAddValid(false);
        setRecIngFormState(emptyRecipeIngredientRecord);
    };

    const handleIngredientAdd = (e: React.MouseEvent) => {
        console.log(e.target);
        //* build rec-ing form state
        //* build component 
        if (recIngFormState) {
            handleRecipeIngredientAdd(recIngFormState);
        }
    };

    const [useFractions, setUseFractions] = useState(false);
    const [searchResLoading, setSearchResLoading] = useState(false);

    const [isIngredientAddValid, setIngredientAddValid] = useState(false);

    const handleDecimalFractionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // fraction = true
        // decimal = false
        console.log('checked:', e.target.checked);
        e.target.checked ? setUseFractions(true) : setUseFractions(false);
    }

    const catchSearchResLoading = (b: boolean) => setSearchResLoading(b);


    useEffect(() => { }, [recIngFormState]);

    return (
        <div className={styles['new-ingredient-info']}>
            <FormRow className='nested'>
                <FieldModule
                    label='Insert Ingredient'
                    id='recipe-ingredient-add'
                >
                    <RecipeIngredientSelector
                        //! hard coded for now
                        userId={1}
                        onIngredientChosen={handleIngredientNameKeypress}
                        setSearchResLoading={catchSearchResLoading}
                        searchCleared={handleSearchCleared}
                    />
                    {searchResLoading && <InputSpinner speed={75} />}
                </FieldModule>
            </FormRow>

            <FormRow className='nested'>
                <FieldModule
                    label='Prep Method'
                    id='recipe-ingredient-add'
                >
                    <AdminInput
                        name='recipe-ingredient-prep'
                        placeholder='sliced thin, 1/4" diced, blanched, etc...'
                        type='text'
                        maxLength={258}
                        value={recIngFormState.prep}
                        onChange={e => setRecIngFormState({ ...recIngFormState, prep: e.target.value })}
                    >
                    </AdminInput>
                </FieldModule>
            </FormRow>

            <FormRow className='nested' >
                <FieldModule
                    label='Amount'
                    id='recipe-ingredient-amount-add'
                >
                    <Toggle2 id='recipe-ingredient-fraction-assign' pos1='fraction' pos2='decimal' onChange={handleDecimalFractionSelect} />
                    <IngredientAmount value={[recIngFormState.amount, recIngFormState.unitId]} fractions={useFractions} />
                </FieldModule>
            </FormRow>

            <FormRow className='nested'>
                <FieldModule
                    label='Notes'
                    id='recipe-ingredient-note'
                >
                    <AdminInput
                        name='recipe-ingredient-note'
                        placeholder='slightly under ripe...'
                        type='text'
                        maxLength={258}
                        className='optional'
                        value={recIngFormState.notes}
                        onChange={e => setRecIngFormState({ ...recIngFormState, notes: e.target.value })}
                    >
                    </AdminInput>
                </FieldModule>
            </FormRow>

            <FormRow className='nested'>
                <FieldModule className="recipe-ingredient-submit-module">
                    <input
                        disabled={!isIngredientAddValid}
                        className={styles["recipe-ingredient-add"]}
                        type="button"
                        onClick={handleIngredientAdd}
                        value={'Add'}
                    />
                </FieldModule>
            </FormRow>



        </div>
    );
}