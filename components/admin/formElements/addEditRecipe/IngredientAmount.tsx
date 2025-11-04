// TODO 
//* move handlers into useForm?

import React, { useEffect, useState } from "react";
import AdminInput from "../AdminInput";
import FractionInputs from "./FractionInputs";
import Select from 'react-select';
import { uomOptions, unitTypes } from "@/utils/uom";
import { AdminOption, FractionValue, IngredientAmountType, RecipeIngredientsRecord, UomOption, UomOptionType, UomType } from "@/types/types";
import { toTitleCase } from "@/utils/utils";

import useRecipeIngredientValues from "@/hooks/useRecipeIngredientValues";

interface Props {
    fractions: boolean;
    value: [
        string | undefined,
        number | undefined | null
    ];
}

export default function IngredientAmount({ fractions, value }: Props) {

    const emptyFractionValue: FractionValue = {
        integer: null,
        fraction: null,
        numerator: null,
        denominator: null,
        decimalEq: null
    }

    const [amountValue, setAmountValue] = useState<string>('');
    const [fractionValue, setFractionValue] = useState<FractionValue>(emptyFractionValue);

    const [uomOptionState, setUomOptionState] = useState<UomOptionType[] | UomOption[]>();
    const [selectedUomType, setSelectedUomType] = useState<UomType>();

    const formattedTypes: UomOptionType[] = unitTypes.map(t => ({ ...t, label: toTitleCase(t.label) }));

    const [selectedUnit, setSelectedUnit] = useState<UomOption | null>(null);
    const [isUnitReady, setUnitReady] = useState(false);

    const [recipeIngredientsRecord, setRecipeIngredientsRecord] = useState<RecipeIngredientsRecord[] | undefined>();

    const [numerator, setNumerator] = useState<number>();
    const [denominator, setDenominator] = useState<number>();

    const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const chars = fractions ? '.+-e'.split('') : '+-e'.split('');
        if (chars.includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
        console.log(e.currentTarget.id, e.key);
        switch (e.currentTarget.id) {
            case 'numerator': setNumerator(Number(e.key)); break;
            case 'denominator': setDenominator(Number(e.key)); break;
        }
        if (e.key.toLowerCase() === 'backspace') {
            switch (e.currentTarget.id) {
                case 'numerator': setNumerator(undefined); break;
                case 'denominator': setDenominator(undefined); break;
            }
        }


        console.log(fractionValue);
    }

    const handleUnitChange = (option: UomOption | UomOptionType | null) => {
        console.log(option);
        if (option) {
            if ("type" in option) {
                setSelectedUnit(option);
            } else {
                setSelectedUomType(option.label.toLowerCase() as UomType);
            }
            setUnitReady(true);
        } else {
            setUomOptionState(formattedTypes);
            setUnitReady(false);
        }
    }

    const handleIngredientAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setAmountValue(e.target.value);
    }

    const handleIncomingValue = (amount: IngredientAmountType) => {
        setAmountValue(String(amount.value.integer));
        if (fractions && ("fraction" in amount.value)) {
            setFractionValue(amount.value);
        }
    };

    const handleIncomingUnit = (unit: any) => { };

    const { interprateValue, matchUnit } = useRecipeIngredientValues();
    useEffect(() => {
        if (value[0] && value[1]) {
            handleIncomingValue(interprateValue(value[0]));
            handleIncomingUnit(matchUnit(value[1]));
        }
    }, []);


    useEffect(() => {
        if (fractions) {
            if (amountValue) {
                const numeric = Number(amountValue);
                const floor = Math.floor(numeric);
                setAmountValue(String(floor));
            }
        }
    }, [fractions]);

    useEffect(() => {
        console.log(numerator, denominator)
        if (numerator) setFractionValue({ ...fractionValue, numerator });
        if (denominator) setFractionValue({ ...fractionValue, denominator });
    }, [numerator, denominator])


    useEffect(() => {
        const filterUomList = (uomOptions: UomOption[]): UomOption[] =>
            uomOptions.filter(opt => opt.type === selectedUomType);

        const newLabels = (uomOptions: UomOption[]): UomOption[] =>
            uomOptions.map(opt => ({ ...opt, label: `${opt.label} (${opt.abbr})` }));

        if (selectedUomType) {
            const filteredList = filterUomList(uomOptions);
            if (selectedUomType !== 'other' && selectedUomType !== 'count')
                setUomOptionState(newLabels(filteredList));
            else
                setUomOptionState(filteredList);
        }
    }, [selectedUomType]);


    useEffect(() => {
        setUomOptionState(formattedTypes);
    }, []);



    return (
        <>
            <AdminInput
                name="igredient-amount-primary"
                onKeyDown={handleNumberInput}
                onChange={handleIngredientAmountChange}
                value={amountValue}
                type="number"
                placeholder="#..."
                className="quick-input"
                min={"0"}
                max={"9999"}
                step={fractions ? 1 : 0.25}
            />

            {fractions && <FractionInputs value={fractionValue} onKeyDown={handleNumberInput} />}

            <Select
                isClearable
                name="ingredient-amount-unit"
                options={uomOptionState}
                classNamePrefix={'recipe-ingredient-uom'}
                onChange={handleUnitChange}
                closeMenuOnSelect={isUnitReady ? true : false}
                placeholder="select unit..."
            />
        </>
    );
}