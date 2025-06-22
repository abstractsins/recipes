import styles from './Toggle.module.css';

interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Toggle({ onChange }: Props) {

    return (
        <>
            <div className={styles["toggle-wrapper"]}>
                <input className={styles["toggle-checkbox"]}
                    type="checkbox"
                    onChange={onChange}
                />
                <div className={styles["toggle-container"]}>
                    <div className={styles["toggle-button"]}></div>
                </div>
            </div>

        </>
    );
}