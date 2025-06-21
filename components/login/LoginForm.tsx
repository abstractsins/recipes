// TODO
//* error handling

'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import RegisterLink from "../general/RegisterLink";

import Loader from "../general/Loader";

export default function LoginForm() {

    // const [isFormValid, setFormValid] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    // const [usernameValue, setUsernameValue] = useState('');
    // const [passwordValue, setPasswordValue] = useState('');
    // const [formData, setFormData] = useState();

    const router = useRouter();

    const maxUserLength = 64;
    const maxPasswordLength = 32;


    // useEffect(() => {
    //     console.log('usernameInput: ' + usernameValue);
    //     console.log('passwordInput: ' + passwordValue);
    //     usernameValue.length >= 3 && passwordValue.length >= 3 ? setFormValid(true) : setFormValid(false);
    // }, [usernameValue, passwordValue]);


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

    // const inputHandling = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     const allowedKeyPresses = ['Backspace', 'Enter', 'Tab', 'Delete'];
    //     const forbiddenChars: Record<string, string[]> = {
    //         text: ' /\\+=()[]{}:;\'"'.split(''),
    //         password: ' '.split(''),
    //     };

    //     const fieldType = e.currentTarget.type;
    //     const key = e.key;

    //     // Block multi-key (e.g., Alt+Key) unless in allowed list and forbidden characters
    //     if (
    //         (key.length > 1 && !allowedKeyPresses.includes(key))
    //         || forbiddenChars[fieldType]?.includes(key)
    //     ) {
    //         e.preventDefault();
    //         return;
    //     }

    //     // Update state
    //     const value = e.currentTarget.value + (allowedKeyPresses.includes(key) ? '' : key);
    //     if (fieldType === 'text') setUsernameValue(value);
    //     else if (fieldType === 'password') setPasswordValue(value);
    // };


    return (
        <>
            <div className="login">

                {isWaiting && <Loader msg="Logging in" />}

                <form id="login-form" onSubmit={handleSubmit}>

                    {/* HEADER */}
                    <div className="login-module" id="header-module">
                        <header>
                            <h2>Welcome</h2>
                        </header>
                    </div>

                    {/* BODY */}
                    <div className="login-form-body">
                        {/* USERNAME */}
                        <div className="login-module" id="username-module">
                            <div className="field-label" id="username-label">
                                <span>username:</span>
                            </div>
                            <div className="field-container" id="username-field-container">
                                <input className="login-page-field" type="text" name="email" maxLength={maxUserLength}
                                    // onKeyDown={inputHandling} 
                                    autoFocus={true} />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="login-module" id="password-module">
                            <div className="field-label" id="password-label">
                                <span>password:</span>
                            </div>
                            <div className="field-container" id="password-field-container">
                                <input required className="login-page-field" name="password" type="password" maxLength={maxPasswordLength}
                                // onKeyDown={inputHandling}
                                />
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    {/* LOGIN  */}
                    <div className="login-module" id="button-module">
                        <input
                            required
                            className={`
                                login-module-button 
                                ${!isWaiting ? 'active' : 'inactive'} 
                                ${isWaiting ? 'disabled waiting' : ''}
                            `}
                            disabled={isWaiting}
                            type="submit"
                            value='login'
                        />
                    </div>
                </form>

                <RegisterLink />

            </div>
        </>

    )
}