import styles from './Environment.module.css';

export default function () {

    const env = process.env.NEXT_PUBLIC_ENV;

    return (
        <div className={styles["env-container"]}>
            <span className={styles["label"]}>environment:</span> <span className={styles["env"]}>{env}</span>
        </div>
    );
}