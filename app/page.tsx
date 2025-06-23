import { PiChefHat } from "react-icons/pi";
import Link from "next/link";
import RegisterLink from "@/components/general/RegisterLink";

import styles from './page.module.css';

export default function Home() {

  return (
    <div className={`${styles['body']} ${styles['splash-page']}`}>

      <header>
        <h1>Recipe Database</h1>
      </header>

      <div className={styles["splash-body"]}>

        <div className={styles["login-container"]}>
          <Link className={`link dark`} href="./login"><span> <PiChefHat /> Login</span></Link>
        </div>

        <RegisterLink theme="dark"/>

      </div>

    </div>
  );
}

