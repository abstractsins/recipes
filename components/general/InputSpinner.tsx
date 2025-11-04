'use client';

import styles from './InputSpinner.module.css'

import { useEffect, useState } from "react";

export default function InputSpinner({ speed = 200 }: { speed?: number }) {

    const [spinnerText, setSpinnerText] = useState('');

    useEffect(() => {
        let count = 0;

        const spinner = () => {
            count++;

            setSpinnerText(prev => {
                switch (prev) {
                    case '': return '.';
                    case '.': return '..';
                    case '..': return '...';
                    case '...': return '....';
                    case '....': return '.....';
                    case '.....': return '';
                    default: return '';
                }
            });
        };

        const interval = setInterval(spinner, speed);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className={styles['spinner-text-container']}>
            <span className={styles['spinner-text']}>
                {spinnerText}
            </span>
        </div>
    );
}