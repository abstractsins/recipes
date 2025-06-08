'use client';

import { useEffect, useState } from "react";

import Recipes from "./Recipes";
import CloseButton from "./CloseButton";
import { Recipe, AdminModule } from "@/types/types";

export default function RecipesModule({ className, onClick: activate, active, close }: AdminModule) {

    const [isLoading, setIsLoading] = useState(true);
    const [recipes, setRecipes] = useState<Recipe[]>([]);


    //* ------------------------------------------
    //* 👥 FETCH RECIPES
    //* ------------------------------------------
    useEffect(() => {
        async function fetchRecipes() {
            try {
                const res = await fetch('/api/recipe');
                const data: Recipe[] = await res.json();
                setRecipes(data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRecipes();
    }, []);

    return (
        <div className={`module ${className}`} id="recipes-module" onClick={activate}>
            <div className="module-header">
                <h2>Recipes</h2>
                <span className="cat-data-label">total:</span><span className="cat-data"> {isLoading ? '--' : recipes.length}</span>
            </div>
            {active &&
                (<>
                    <div className="module-body">
                        {
                            isLoading
                                ? <div className="users-skeleton"></div>
                                : <Recipes data={recipes} />
                        }
                    </div>

                    <CloseButton onClick={close} />
                </>
                )}
        </div>
    );
}