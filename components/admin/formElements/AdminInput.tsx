import React from 'react';

import styles from './AdminInput.module.css';

import { AdminInputProps } from '@/types/types';

export default function AdminInput({
    name,
    className = '',
    placeholder = '',
    type = 'text',
    maxLength = 56,
    required = false,
    disabled = false,
    value,
    min, max,
    onChange,
    onKeyDown
}: AdminInputProps) {

    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            required={required}
            disabled={disabled}
            className={`${styles['admin-input']} ${className}`}
            value={value}
            min={min}
            max={max}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
    );
}
