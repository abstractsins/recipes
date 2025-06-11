import { Recipe, User } from "@/types/types";
import { useEffect, useState } from "react";

interface Props {
    data: Recipe[]
}

export default function Recipes({ data }: Props) {

    const [dataStr, setDataStr] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        let str = JSON.stringify(data, null, 2);
        setDataStr(str);
    }, [data]);

    return (
        <>
            <ul>

                <ul>
                    {
                        data.map((recipe) => {
                            const user: User | { username: string } = recipe.user || { username: 'Default' };
                            console.log(user);
                            return (
                                <li key={recipe.id}>
                                    <span className="recipe-name">{recipe.name}</span> --
                                    <span className="recipe-creator">{user.username}</span>
                                </li>
                            )
                        })
                    }
                </ul>

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
