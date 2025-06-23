// TODO
//* error handling

'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import RegisterLink from "../general/RegisterLink";

import Loader from "../general/Loader";

import styles from "./LoginForm.module.css";

export default function LoginForm() {

    const [isWaiting, setIsWaiting] = useState(false);

    const router = useRouter();

    const maxUserLength = 64;
    const maxPasswordLength = 32;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(e);
        setIsWaiting(true);
        const fd = new FormData(e.currentTarget)

        console.log([...fd.entries()]);

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: fd,
            credentials: 'include'
        });

        console.log(res);

        if (res.ok) {
            console.log('LOGIN OK!');
            await res.json();
            router.push('/profile');
        } else {
            alert('Login failed');
            setIsWaiting(false);
        }

    }


    return (
        <>
            <div className={`${styles["login"]}`}>

                {isWaiting && <Loader msg="Logging in" />}

                <form id="login-form" className={styles['login-form']} onSubmit={handleSubmit}>

                    {/* HEADER */}
                    <div className={`${styles["login-module"]} ${styles["header-module"]}`}>
                        <header>
                            <h2>Welcome</h2>
                        </header>
                    </div>

                    {/* BODY */}
                    <div className={`${styles["login-form-body"]}`}>
                        {/* USERNAME */}
                        <div className={`${styles["login-module"]} ${styles["username-module"]}`}>
                            <div className={`${styles["field-label"]} ${styles["username-label"]}`}>
                                <span>username:</span>
                            </div>
                            <div className={`${styles["field-container"]} ${styles["username-field-container"]}`}>
                                <input
                                    className={`${styles["login-page-field"]}`}
                                    type="text"
                                    name="email"
                                    maxLength={maxUserLength}
                                    // onKeyDown={inputHandling}
                                    autoFocus={true}
                                    disabled={isWaiting}
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className={`${styles["login-module"]} ${styles["password-module"]}`}>
                            <div className={`${styles["field-label"]} ${styles["password-label"]}`}>
                                <span>password:</span>
                            </div>
                            <div className={`${styles["field-container"]} ${styles["password-field-container"]}`}>
                                <input
                                    required
                                    className={`${styles["login-page-field"]}`}
                                    name="password" type="password"
                                    maxLength={maxPasswordLength}
                                // onKeyDown={inputHandling}
                                />
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    {/* LOGIN  */}
                    <div className={`${styles["login-module"]} ${styles["button-module"]}`}>
                        <input
                            required
                            className={`
                                ${styles["login-module-button"]}
                                ${!isWaiting ? styles['active'] : styles['inactive']} 
                                ${isWaiting && styles['disabled']} 
                                ${isWaiting && styles['waiting']}
                            `}
                            disabled={isWaiting}
                            type="submit"
                            value='login'
                        />
                    </div>
                </form>
                
                <RegisterLink theme="light" />

            </div>
        </>

    )
}