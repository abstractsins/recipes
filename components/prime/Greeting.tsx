import styles from './Greeting.module.css'

export default function Greeting({ nickname }: { nickname: string | undefined }) {

    return (
        <div className={styles["greeting-container"]}>
            <span>Hello, {nickname}</span>
        </div>
    );
}