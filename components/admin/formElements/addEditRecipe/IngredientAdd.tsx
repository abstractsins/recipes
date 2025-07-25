import styles from './IngredientAdd.module.css';
import { FiPlusCircle } from "react-icons/fi";
import AdminInput from '../AdminInput';
import IngredientAmount from './IngredientAmount';
import FormRow from "../FormRow";
import RecipeIngredientSelector from './RecipeIngredientSelect';
import FieldModule from '../FieldModule';
import Toggle2 from '@/components/general/Toggle2';
import { useState } from 'react';

export default function IngredientAdd() {

    const handleIngredientAdd = () => { };
    const handleIngredientNameKeypress = () => { };

    const [useFractions, setUseFractions] = useState(false);
    const handleDecimalFractionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // fraction = true
        // decimal = false
        console.log('checked:', e.target.checked);
        e.target.checked ? setUseFractions(true) : setUseFractions(false);
    }

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
                        onIngredientChosen={() => { }}
                    />
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
                    >
                    </AdminInput>
                </FieldModule>
            </FormRow>

            <FormRow className='nested' >
                <FieldModule id={'decimal-fraction-select'}>
                    <Toggle2 id='recipe-ingredient-fraction-assign' pos1='fraction' pos2='decimal' onChange={handleDecimalFractionSelect} />
                </FieldModule>

                <FieldModule
                    label='Amount'
                    id='recipe-ingredient-amount-add'
                    className={'nested'}
                >
                    <IngredientAmount fractions={useFractions} />
                </FieldModule>
            </FormRow>

            <div
                className={`${styles["plus-circle-container"]} ${styles['dark']}`}
                onClick={handleIngredientAdd}
            >
                <FiPlusCircle />
            </div>
        </div>
    );
}