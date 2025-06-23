'use client';

import AdminSelect from "./formElements/AdminSelect";
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
    onSelect?: (tag: TagOption) => void;
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

    const { tagOptions, isLoading } = useFetchTags({ type, user, refreshKey });

    return (
        <AdminSelect
            name={name}
            isLoading={isLoading}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange}
            multiple={multiple}
            options={tagOptions}
        />
    );
}