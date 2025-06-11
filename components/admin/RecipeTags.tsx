import { Tag, User } from "@/types/types";
import { useEffect, useState } from "react";

interface Props {
    data: Tag[]
}

export default function RecipeTags({ data }: Props) {

    const [dataStr, setDataStr] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        let str = JSON.stringify(data, null, 2);
        setDataStr(str);
    }, [data]);

    return (
        <>
            <ul>
                {
                    data.map((tag) => {
                        const user : User | string = tag.createdByUser || 'Default';
                        return (
                            <li key={tag.id}>
                                <span className="tag-name">{tag.name}</span> --
                                <span className="tag-creator">{tag.createdBy === null ? 'Default' : 'user ' + user.username }</span>
                            </li>
                        )
                    })
                }
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