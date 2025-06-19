'use client';

import { useEffect, useState } from "react";
import { Tag } from "@/types/types";

import { TagType } from "@prisma/client";

interface Props {
    type: TagType,
    user: number | null,
    refreshKey: number | null
}

export function useFetchTags({ type, user, refreshKey }: Props) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTags() {
            try {
                const res = await fetch(`/api/tag/${type}/user/${user}`);
                const data: Tag[] = await res.json();
                setTags(data);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTags();
    }, [refreshKey]);

    return { tags, isLoading };
}
