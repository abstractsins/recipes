import Select from 'react-select';
import { useDashboard } from "@/context/DashboardContext";
import { TagOption, Tag, UserOption } from '@/types/types';
import { useEffect, useState } from 'react';

interface Props {
    user: UserOption | null;
    onSelect: (value: TagOption | null) => void;
    value?: TagOption | null;
    options: Tag[] | null;
    disabled?: boolean;
}

export default function TagDropSelect({
    user,
    onSelect,
    value,
    options,
    disabled = false
}: Props) {

    const [mappedTags, setMappedTags] = useState<TagOption[]>();

    const {
        loadUserTags
    } = useDashboard();

    const handleSelect = (selectedOption: TagOption | null) => {
        if (onSelect) {
            onSelect(selectedOption || null);
        }
    }

    useEffect(() => {
        if (options) {
            console.log(options);
            const tagOptions = options.map(el => {
                return {
                    id: el.id,
                    value: el.name,
                    type: el.type,
                    label: `[${el.id}] -- ${el.name} -- [${el.type}]`
                }
            });
            setMappedTags(tagOptions);
        }
    }, [options]);

    return (
        <Select
            value={value}
            isDisabled={disabled}
            onChange={handleSelect}
            className={`${disabled && 'disabled'}`}
            classNamePrefix='add-edit-tag'
            name="tag"
            defaultValue={null}
            options={mappedTags}
            isClearable
        />
    );

}