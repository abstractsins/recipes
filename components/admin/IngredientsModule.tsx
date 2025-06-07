'use client';

import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";

import { AdminModule } from "@/types/types";

export default function IngredientsModule({ className, onClick: activate, active, close }: AdminModule) {

    const [isLoading, setIsLoading] = useState(true);


    //* ------------------------------------------
    //* 👥 FETCH USERS
    //* ------------------------------------------
    useEffect(() => {

    }, []);

    return (
        <div className={`module ${className}`} id="ingredients-module" onClick={activate}>
            <div className="module-header">
                <h2>Ingredients</h2>
                <span className="cat-data-label">total:</span><span className="cat-data"> {isLoading ? '--' : users.length}</span>
            </div>
            {active &&
                (<>
                    <div className="module-body">
                        {
                            isLoading
                                ? <div className="users-skeleton"></div>
                                : <Recipes data={ingredients} />
                        }
                    </div>

                    <div className="close-btn" onClick={close}><RiCloseFill /></div>
                </>
                )}
        </div>
    );
}