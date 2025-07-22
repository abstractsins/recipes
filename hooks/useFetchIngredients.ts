import { useEffect, useState } from "react";
import { Ingredient } from "@/types/types";

interface Props {
  refreshKey: number | null;
}

export function useFetchIngredients({ refreshKey }: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (async function fetchUsers() {
      try {
        const res = await fetch('/api/ingredient');
        const data: Ingredient[] = await res.json();
        const sorted = data.sort((a, b) => Number(a.id) - Number(b.id));
        setIngredients(sorted);
      } catch (err) {
        console.error("Failed to fetch ingredients:", err);
      } finally {
        setIsLoading(false);
      }
    })()
  }, [refreshKey]);

  useEffect(() => { console.log('isLoading:', isLoading) }, [isLoading])

  return { ingredients, isLoading };
}
