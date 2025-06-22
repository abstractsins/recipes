import Link from "next/link"
import styles from "./RegisterLink.module.css";

export default function RegisterLink() {
    return (
        <div className={styles["register-container"]}>
            <div>
                <span>New to the site? <Link className={`link light`} href="./register">Register here.</Link></span>
            </div>
        </div>
    )
}