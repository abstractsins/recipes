import Select from 'react-select';
import { useDashboard } from "@/context/DashboardContext";
import { TagOption, Tag } from '@/types/types';
import { useEffect, useState } from 'react';

interface Props {
    user: number | null;
    onSelect: (value: TagOption | null) => void;
    value?: TagOption | null;
    disabled?: boolean;
}

export default function TagDropSelect({
    user,
    onSelect,
    value,
    disabled = false
}: Props) {

    const [tagData, setTagData] = useState<Tag[] | undefined>();
    const [mappedTags, setMappedTags] = useState<TagOption[]>();

    const {
        loadUserTags
    } = useDashboard();

    const handleSelect = (selectedOption: TagOption | null) => {
        if (onSelect) {
            onSelect(selectedOption || null);
        }
    }
    
    const getTagData = async() => await loadUserTags('ingredient', user);

    useEffect(() => {
        console.log(getTagData());
    }, [user]);

    useEffect(() => {
        if (tagData) {
            const mappedTags = tagData?.map(el => {
                return {
                    id: el.id,
                    value: el.name,
                    label: `${el.id}: ${el.name} -- ${el.type}`
                }
            });
            setMappedTags(mappedTags);
        }
    }, [tagData]);

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