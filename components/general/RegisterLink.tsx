import Link from "next/link"
import styles from "./RegisterLink.module.css";

interface Props {
    theme: string;
}

export default function RegisterLink({theme}: Props) {
    return (
        <div className={`${styles["register-container"]} ${theme}`}>
            <div>
                <span>New to the site? <Link className={`link ${theme}`} href="./register">Register here.</Link></span>
            </div>
        </div>
    )
}