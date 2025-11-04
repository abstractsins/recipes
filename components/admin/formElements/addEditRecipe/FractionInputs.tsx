import { FractionValue } from "@/types/types";
import AdminInput from "../AdminInput";
import styles from './FractionInput.module.css'

interface Props {
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    value: FractionValue | undefined;
}

export default function FractionInputs({ onKeyDown, value }: Props) {
    return (
        <div className={`${styles['container']} condensed`}>
            <AdminInput
                name="igredient-amount-numerator"
                onKeyDown={onKeyDown}
                type="number"
                placeholder=""
                className={`condensed quick-input`}
                min={"0"}
                max={"99999"}
                maxLength={7}
                value={value?.numerator || ''}
                id="numerator"
            />

            <div className={`${styles['operator-container']}`}>
                <span className={`condensed`}>/</span>
            </div>

            <AdminInput
                name="igredient-amount-denominator"
                onKeyDown={onKeyDown}
                type="number"
                placeholder=""
                className={`condensed quick-input`}
                min={"0"}
                max={"99999"}
                maxLength={7}
                value={value?.denominator || ''}
                id="denominator"
            />
        </div>
    );
}