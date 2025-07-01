import { useEffect, useState } from "react";
import { Recipe } from "@/types/types";

interface Props {
  refreshKey: number | null;
}


export function useFetchRecipes({ refreshKey }: Props) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
    }, [refreshKey]);

    return { recipes, isLoading }
}