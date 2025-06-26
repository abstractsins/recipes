import styles from './AdminSelect.module.css';
import Select from 'react-select';
import { useDashboard } from "@/context/DashboardContext";


type UserOption = {
    value: number | null;
    label: string;
};

interface Props {
    onSelect: (value: number | null) => void;
}

export default function UserSelect({ onSelect }: Props) {

    const { users } = useDashboard();

    const handleSelect = (selectedOption: UserOption | null) => {
        if (onSelect) {
            onSelect(selectedOption?.value || null);
        }
    }

    const mappedUsers = users.map(el => {
        return {
            value: el.id,
            label: `${el.id}: ${el.username} -- ${el.nickname}, ${el.email}`
        }
    })


    return (
        <Select<UserOption>
            onChange={handleSelect}
            className={styles["admin-select"]}
            classNamePrefix='add-edit-user'
            name="user"
            defaultValue={null}
            options={mappedUsers}
            isClearable
        />
    );
}