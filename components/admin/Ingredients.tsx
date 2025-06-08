import { Ingredient } from "@/types/types";
import { useEffect, useState } from "react";

interface Props {
    data: Ingredient[]
}

export default function Ingredients({ data }: Props) {

    const [dataStr, setDataStr] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        let str = JSON.stringify(data, null, 2);
        setDataStr(str);
    }, [data]);

    return (
        <>
            <ul>
                {data.map((ingredient) => (
                    <li key={ingredient.id}>{ingredient.name}</li>
                ))}
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
