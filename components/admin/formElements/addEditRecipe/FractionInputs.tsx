import AdminInput from "../AdminInput";
import styles from './FractionInput.module.css'

interface Props {
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function FractionInputs({ onKeyDown }: Props) {
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
            />
        </div>
    );
}