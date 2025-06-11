'use client';

import { useEffect, useState } from "react";

import { Ingredient, AdminModule } from "@/types/types";
import Ingredients from "./Ingredients";
import CloseButton from "./CloseButton";

export default function IngredientsModule({ className, onClick: activate, active, close }: AdminModule) {

    const [isLoading, setIsLoading] = useState(true);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);


    //* ------------------------------------------
    //* 👥 FETCH INGREDIENTS
    //* ------------------------------------------
    useEffect(() => {
        async function fetchingredients() {
            try {
                const res = await fetch('/api/ingredient');
                const data: Ingredient[] = await res.json();
                setIngredients(data);
            } catch (err) {
                console.error("Failed to fetch ingredients:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchingredients();
    }, []);

    return (
        <div className={`module ${className}`} id="ingredients-module" onClick={activate}>
            <div className="module-header">
                <h3>Ingredients</h3>
                <span className="cat-data-label">total:</span><span className="cat-data"> {isLoading ? '--' : ingredients.length}</span>
            </div>
            {active &&
                (<>
                    <div className="module-body">
                        {
                            isLoading
                                ? <div className="ingredients-skeleton"></div>
                                : <Ingredients data={ingredients} />
                        }
                    </div>

                    <CloseButton onClick={close} />

                </>
                )}
        </div>
    );
}