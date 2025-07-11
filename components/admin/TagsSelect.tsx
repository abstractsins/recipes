'use client';

import { useFetchTags } from "@/hooks/useFetchTags";
import { AdminMultiSelectProps, TagOption} from "@/types/types";
import { TagType } from "@prisma/client";

import AdminMultiSelect from "./formElements/AdminMultiSelect";


interface Props extends AdminMultiSelectProps {
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
        <AdminMultiSelect
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