import { useEffect, useState } from "react";
import { User } from "@/types/types";
import { useMemo } from "react";

interface Props {
  refreshKey: number | null;
}

export function useFetchUsers({ refreshKey }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/user');
        const data: User[] = await res.json();
        const sorted = data.sort((a, b) => Number(a.id) - Number(b.id));
        setUsers(sorted);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [refreshKey]);


  return useMemo(() => ({ users, isLoading }), [users, isLoading]);
}
