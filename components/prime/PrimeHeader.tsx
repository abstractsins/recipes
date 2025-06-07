'use client';

import { useEffect } from "react";

export default function PrimeHeader() {

    const env = process.env.NEXT_PUBLIC_ENV;
    useEffect(() => {
        console.log('Environment: ' + env);
    }, [])

    return (
        <header className="prime-header">
            <p>
                <span className="label">environment:</span> <span className="env">{env}</span>
            </p>
        </header>
    )
}