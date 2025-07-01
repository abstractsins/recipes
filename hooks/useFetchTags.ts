'use client';

import { useEffect, useState } from "react";
import { Tag } from "@/types/types";
import { TagType } from "@prisma/client";

interface IncomingTags {
    defaultTags: Tag[];
    userTags: Tag[]
}

interface Props {
    type: TagType,
    user: number | null,
    refreshKey: number | null
}

export function useFetchTags({ type, user, refreshKey }: Props) {
    const [defaultTags, setDefaultTags] = useState<Tag[]>([]);
    const [userTags, setUserTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchString = user != null
        ? `/api/tag/${type}/user/${user}`
        : `/api/tag/${type}`;

    useEffect(() => {
        async function fetchTags() {

            setIsLoading(true);

            try {
                const res = await fetch(fetchString);
                const { defaultTags, userTags }: IncomingTags = await res.json();
                console.log(defaultTags);
                console.log(userTags);

                setDefaultTags(defaultTags);
                setUserTags(userTags);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTags();
    }, [fetchString, user, refreshKey]);


    return { defaultTags, userTags, isLoading };
}
