import styles from './Toggle2.module.css';

interface Props {
    id: string;
    pos1: string;
    pos2: string;
    value?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Toggle2({id, pos1, pos2, value, onChange} : Props) {
    return (
        <div className={`${styles['can-toggle']} ${styles['demo-rebrand-1']}`}>
            <input id={id} type="checkbox" onChange={onChange} checked={value} />
                <label htmlFor={id}>
                    <div className={styles['can-toggle__switch']} data-checked={`${pos1}`} data-unchecked={`${pos2}`}></div>
                </label>
        </div>
    );
}