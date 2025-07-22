'use client';

import styles from './ReadoutSpinner.module.css'

import { useEffect, useState } from "react";

export default function ReadoutSpinner() {

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
                    case '.....': return '......';
                    case '......': return '.......';
                    case '.......': return '........';
                    case '........': return '.........';
                    case '.........': return '..........';
                    case '..........': return '...........';
                    case '...........': return '............';
                    case '............': return '.............';
                    case '..............': return '';
                    default: return '';
                }
            });
        };

        const interval = setInterval(spinner, 100);
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