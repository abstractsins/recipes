import styles from './AdminMultiSelect.module.css';
import Select from 'react-select';
import { useDashboard } from "@/context/DashboardContext";
import { useState } from 'react';
import { UserOption } from '@/types/types';

interface Props {
    onSelect: (value: UserOption | null) => void;
    value: UserOption | null;
}

export default function UserSelect({ onSelect, value }: Props) {

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