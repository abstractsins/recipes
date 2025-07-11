import styles from './AdminDropDownSelect.module.css';

import Select from 'react-select';

import { AdminDropDownSelectProps } from '@/types/types';

export default function AdminDropDownSelect({
    name,
    id,
    required,
    defaultValue,
    value,
    className,
    options,
    isClearable,
    onChange
 }: AdminDropDownSelectProps) {

    return (
        <Select
            name={name}
            id={id}
            required={required}
            value={options?.find(opt => opt.id === defaultValue) ?? null}
            className={styles["admin-select"]}
            options={options}
            isClearable={isClearable}
            onChange={onChange}
        />

    );
}