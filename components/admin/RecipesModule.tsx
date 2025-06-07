'use client';

import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";

import { Recipe, AdminModule } from "@/types/types";

import Recipes from "./Recipes";

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

                    <div className="close-btn" onClick={close}><RiCloseFill /></div>
                </>
                )}
        </div>
    );
}