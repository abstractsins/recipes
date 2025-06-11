import { User } from "@/types/types";
import { useEffect, useState } from "react";

interface Props {
    data: User[]
}

export default function Users({ data }: Props) {

    const [dataStr, setDataStr] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        let str = JSON.stringify(data, null, 2);
        setDataStr(str);
    }, [data]);

    return (
        <>
            <ul>
                {data.map((user) => <li key={user.id}>{user.nickname} --<span className="user-creator">{user.username}</span></li>)}
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
