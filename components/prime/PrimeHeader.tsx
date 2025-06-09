'use client';

import { useEffect } from "react";
import LogoutButton from "../LogoutButton";

interface Props { nickname: string }

export default function PrimeHeader({nickname}: Props) {

    const env = process.env.NEXT_PUBLIC_ENV;
    useEffect(() => {
        console.log('Environment: ' + env);
    }, [])

    return (
        <header className="prime-header">

            <div className="env-container">
                <span className="label">environment:</span> <span className="env">{env}</span>
            </div>

            <div className="greeting-container">
                <span>Hello, {nickname}</span>
            </div>

            <div className="header-buttons">
                <LogoutButton />
            </div>

        </header>
    )
}