'use client';

//* -------------------------------------- //
//* ----------------IMPORTS--------------- //
//* -------------------------------------- //

//* COMPONENTS
import AdminMultiSelect from "./formElements/AdminMultiSelect";

//* TYPES
import { AdminMultiSelectProps, TagOption} from "@/types/types";
import { TagType } from "@prisma/client";



//* -------------------------------------- //
//* ---------------INTERFACE-------------- //
//* -------------------------------------- //

interface Props extends AdminMultiSelectProps {
    type: TagType;
    user: number | null;
    onSelect?: (tag: TagOption) => void;
}



//* -------------------------------------- //
//* ----------------EXPORTS--------------- //
//* -------------------------------------- //

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