import {
    User,
    Ingredient,
    Tag
} from "@/types/types";

import { useEffect, useState } from "react";

import styles from './Entries.module.css';

interface Props {
    data: User[] | Ingredient[] | Tag[]
}

export default function Entries({ data }: Props) {

    const [dataStr, setDataStr] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        let str = JSON.stringify(data, null, 2);
        setDataStr(str);
    }, [data]);

    return (
        <>
            <ul>
                {data.map((entry) => {
                    console.log(entry);
                    if ('nickname' in entry) {
                        return (<li key={entry.id}>{entry.nickname} --<span className={styles["creator"]}>{entry.username}</span></li>)
                    } else if ('userId' in entry) {
                        return (<li key={entry.id}>{entry.name} --<span className={styles["creator"]}> user: {String(entry.userId)}</span></li>)
                    } else if ('createdBy' in entry) {
                        const user: User | { username: string } = entry.createdByUser || { username: 'Default' };
                        return (<li key={entry.id}>{entry.name} --<span className={styles["creator"]}>{user.username}</span></li>)
                    }
                })}
            </ul>

            {showDetails
                ? (<>
                    <div className="details button" onClick={() => setShowDetails(false)}>LESS DETAILS 🦴</div>
                    <pre className="details">
                        {dataStr}
                    </pre>
                </>)
                : <div className="details button" onClick={() => setShowDetails(true)}>MORE DETAILS 🥩</div>
            }

        </>
    );
}
