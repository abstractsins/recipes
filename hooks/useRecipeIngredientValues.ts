'use client';

//* --------------------------------------- //
//* -----------------IMPORTS--------------- //
//* --------------------------------------- //

import {
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";

import { DecimalValue, FractionValue, IngredientAmountType, UomOption } from "@/types/types";

import { useRecIng } from "@/context/RecipeIngredientContext";

import {
} from "@/utils/utils";



//* --------------------------------------- //
//* -----------------EXPORTS--------------- //
//* --------------------------------------- //

export default function useRecipeIngredientValues() {

    const interprateValue = (rawValue: string): IngredientAmountType => {
        const format = rawValue.indexOf('/') > -1 ? 'fraction' : 'decimal';

        if (format === 'fraction') {

            const integer: number = rawValue.indexOf('-') > -1 ? Number(rawValue.split('-')[0]) : 0;
            const fraction: string = integer > 0 ? rawValue.split('-')[1] : rawValue;
            const numerator: number = Number(fraction.split('/')[0]);
            const denominator: number = Number(fraction.split('/')[1]);
            const decimalEq: number = (numerator / denominator) + integer;

            const fractionValue: FractionValue = {
                original: rawValue,
                integer,
                fraction,
                numerator, denominator,
                decimalEq
            };

            return { format, value: fractionValue }
        }

        const number: number = Number(rawValue);
        const integer: number = Math.floor(number);
        const remainder: number = rawValue.indexOf('.') > -1
            ? Number(rawValue.split('.')[1])
            : 0;

        const decimalValue: DecimalValue = {
            original: rawValue,
            number,
            integer,
            remainder,
        };

        return { format, value: decimalValue }
    }

    const matchUnit = (unitId: number) => {

    }

    return { interprateValue, matchUnit };

}