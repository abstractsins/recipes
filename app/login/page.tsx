'use client';

import LoginForm from "@/components/login/LoginForm";
import styles from "./page.module.css";
import { RiCloseFill } from "react-icons/ri";

import "../css/popup.css";

import { useState } from "react";

export default function Home() {

  const [popup, setPopup] = useState(true);

  const closePopup = () => setPopup(false);

  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;

  return (
    <div className={`${styles['body']} ${styles['login-page']}`}>

      {/* <h1>Recipe Database</h1> */}

      {(popup && env !== 'local') &&
        <div className="popup" id="demo-creds">
          <div className="demo-creds-body">
            <header>
              <span>Checking us out?</span>
            </header>
            <div className="creds">
              <span className="label">user:</span> <span>demo@demo.com</span>
              <br></br>
              <span className="label">pass:</span> <span>DanBerlin!1</span>
            </div>
          </div>
          <div className="close-button" onClick={closePopup}><RiCloseFill /></div>
        </div>
      }

      <div className={styles['login-container']}>
        <LoginForm />
      </div>

    </div>
  );
}