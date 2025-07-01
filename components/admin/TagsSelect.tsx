'use client';

import { useFetchTags } from "@/hooks/useFetchTags";
import { AdminSelectProps, TagOption} from "@/types/types";
import { TagType } from "@prisma/client";

import AdminSelect from "./formElements/AdminSelect";


interface Props extends AdminSelectProps {
    type: TagType;
    user: number | null;
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
    onSelect,
    isLoading,
    options
}: Props) {

    return (
        <AdminSelect
            name={name}
            isLoading={isLoading}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange}
            multiple={multiple}
            options={options}
            className={`tag`}
        />
    );
}