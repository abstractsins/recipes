// TODO 
//* move handlers into useForm?

import React, { useEffect, useState } from "react";
import AdminInput from "../AdminInput";
import FractionInputs from "./FractionInputs";
import Select from 'react-select';
import { uomOptions } from "@/utils/uom";
import { AdminOption, UomOption } from "@/types/types";

interface Props {
    fractions: boolean;
}

export default function IngredientAmount({ fractions }: Props) {

    const [amountValue, setAmountValue] = useState<string | undefined>();

    const [ingredientAmountPrimary, setIngredientAmountPrimary] = useState<number | null>(null);

    const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const chars = fractions ? '.+-e'.split('') : '+-e'.split('');
        if (chars.includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
        setIngredientAmountPrimary(Number(e.currentTarget.value));
    }

    const [selectedUnit, setSelectedUnit] = useState<UomOption | null>(null);
    const [isUnitReady, setIsUnitReady] = useState(false);
    const handleUnitChange = (unitOption: UomOption | null) => {
        if (unitOption !== null) {
            setIsUnitReady(true);
        }
        setSelectedUnit(unitOption);
    }

    const handleIngredientAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setAmountValue(e.target.value);
    }

    useEffect(() => {
        if (fractions) {
            if (amountValue) {
                const numeric = Number(amountValue);
                const floor = Math.floor(numeric);
                setAmountValue(String(floor));
            }
        }
    }, [fractions]);

    return (
        <>
            <AdminInput
                name="igredient-amount-primary"
                onKeyDown={handleNumberInput}
                onChange={handleIngredientAmountChange}
                value={amountValue}
                type="number"
                placeholder="Amt..."
                className="quick-input"
                min={"0"}
                max={"9999"}
                maxLength={7}
            />

            {fractions && <FractionInputs onKeyDown={handleNumberInput} />}

            <Select
                isClearable
                name="ingredient-amount-unit"
                options={uomOptions}
                classNamePrefix={'recipe-ingredient-uom'}
                onChange={handleUnitChange}
                placeholder="select unit..."
            />
        </>
    );
}