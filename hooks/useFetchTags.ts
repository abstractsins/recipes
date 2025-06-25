'use client';

import { useEffect, useState } from "react";
import { Tag, TagOption } from "@/types/types";
import { TagType } from "@prisma/client";
import { tagsIntoOptions } from "@/utils/utils";

interface Props {
    type: TagType,
    user: number | null,
    refreshKey: number | null
}

export function useFetchTags({ type, user, refreshKey }: Props) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchString = user === 0 ? 'api/tag/'+type : '/api/tag/'+type+'/user/'+user;

    useEffect(() => {
        console.log(user);
        async function fetchTags() {
            try {
                const res = await fetch(fetchString);
                const data: Tag[] = await res.json();
                console.log(data);
                setTags(data);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTags();
    }, [refreshKey]);

    useEffect(() => { if (tags) setTagOptions(tagsIntoOptions(tags)) }, [tags]);

    return { tagOptions, tags, isLoading };
}
