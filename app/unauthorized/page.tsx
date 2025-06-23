import LogoutButton from "@/components/profile/LogoutButton";
import styles from './page.module.css';
export default function Unauthorized() {

    return (
        <div className={styles["unauthorized-page"]}>
            <h1>Who tf are you? Non admin.</h1>
            <LogoutButton theme="dark"/>
        </div>
    );
}