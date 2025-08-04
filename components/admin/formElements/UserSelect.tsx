import Select from 'react-select';
import { useDashboard } from "@/context/DashboardContext";
import { UserOption } from '@/types/types';

interface Props {
    onSelect: (value: UserOption | null) => void;
    value?: UserOption | null;
    disabled?: boolean;
}

export default function UserSelect({
    onSelect,
    value,
    disabled = false
}: Props) {

    const { users } = useDashboard();

    const handleSelect = (selectedOption: UserOption | null) => {
        if (onSelect) {
            onSelect(selectedOption || null);
        }
    }

    const mappedUsers = users.map(el => {
        return {
            value: el.id,
            label: `${el.id}: ${el.username} -- ${el.nickname}, ${el.email}`
        }
    })

    return (
        <Select
            value={value}
            isDisabled={disabled}
            onChange={handleSelect}
            className={`${disabled && 'disabled'}`}
            classNamePrefix='add-edit-user'
            name="user"
            defaultValue={null}
            options={mappedUsers}
            isClearable
        />
    );
}