"use client";

import { useEffect, useState } from "react";
import { toTitleCase } from "@/utils/utils";

import styles from './Loader.module.css';

interface Props { msg: string }

export default function Loader({ msg }: Props) {
    const [loadText, setLoadText] = useState(msg);

    useEffect(() => {
        setTimeout(() => {
            const cap = toTitleCase(msg);
            msg = msg.toLowerCase();
            switch (loadText.toLowerCase()) {
                case msg: setLoadText(cap + '.'); break;
                case msg + '.': setLoadText(cap + '..'); break;
                case msg + '..': setLoadText(cap + '...'); break;
                case msg + '...': setLoadText(cap); break;
            }
        }, 250);
    }, []);

    return (
        <div className={styles["loader"]}>
            <span className={styles["load-text"]}>
                {loadText}
            </span>
        </div>
    )
}