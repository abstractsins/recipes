'use client';

import AdminSelect from "./AdminSelect";
import { useFetchTags } from "@/hooks/useFetchTags";

import { AdminSelectProps } from "@/types/types";
import { TagType } from "@prisma/client";

import { toTitleCase } from "@/utils/utils";

import { TagOption } from "@/types/types";
import { useEffect, useState } from "react";

interface Props extends AdminSelectProps {
    type: TagType;
    user: number | null;
    refreshKey?: number | null,
    onSelect?: (value: string) => void;
}

export default function TagsSelect({ 
    name, 
    disabled, 
    defaultValue,
    onChange, 
    multiple, 
    type, 
    user, 
    refreshKey = 0,
    onSelect 
}: Props) {

    const [modTags, setModTags] = useState<TagOption[]>([]);

    const { tags } = useFetchTags({type, user, refreshKey});

    useEffect(() => {
        let modTagsArr: TagOption[] = [];
        for (const tag of tags) {
            const { id, name } = tag;
            const label = toTitleCase(name);
            const value = name;
            modTagsArr.push({ id, name, label, value });
        }
        setModTags(modTagsArr);
    }, [tags]);

    return (
        <AdminSelect
            name={name}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange}
            multiple={multiple}
            options={modTags}
        />
    );
}