'use client';

//* -------------------------------------- //
//* ----------------IMPORTS--------------- //
//* -------------------------------------- //

//* REACT
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
    useCallback
} from 'react';

//* COMPONENTS

//* TYPES
import { RecIngContextValue, RecipeIngredientsRecord } from '@/types/types';

//* UTILS


const RecipeIngredientContext = createContext<RecIngContextValue | undefined>(undefined);


//* -------------------------------------- //
//* ---------------INTERFACE-------------- //
//* -------------------------------------- //

interface RecIngProviderProps { children: ReactNode }



//* -------------------------------------- //
//* ----------------EXPORTS--------------- //
//* -------------------------------------- //

export function RecIngProvider({ children }: RecIngProviderProps) {
    
    const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientsRecord[] | []>([]);
    const handleRecipeIngredientAdd = useCallback((rec: RecipeIngredientsRecord) => {
        setRecipeIngredients(prev => [...prev, rec]);
    }, []);
    
    const emptyRecipeIngredientRecord: RecipeIngredientsRecord = {
        ingredientId: null,
        prep: '',
        amount: '',
        unitId: null,
        notes: ''
    }

    const value: RecIngContextValue = useMemo(() => ({
        /* app data / helpers */
        recipeIngredients,
        handleRecipeIngredientAdd,
        emptyRecipeIngredientRecord
    }), [
        recipeIngredients
    ]);

    return (
        <RecipeIngredientContext.Provider value={value}>
            {children}
        </RecipeIngredientContext.Provider>
    );
}

export function useRecIng() {
    const context = useContext(RecipeIngredientContext);
    if (!context) {
        throw new Error('useRecIng must be used within a useRecIngProvider');
    }
    return context;
}
