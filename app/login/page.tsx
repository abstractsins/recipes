import LoginForm from "@/components/login/LoginForm";
import styles from "./page.module.css";

export default function Home() {

  return (
    <div className={`${styles['body']} ${styles['login-page']}`}>

      {/* <h1>Recipe Database</h1> */}

      <div className={styles['login-container']}>
        <LoginForm />
      </div>

    </div>
  );
}