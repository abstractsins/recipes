import React from 'react';

interface AdminInputProps {
    name: string;
    placeholder?: string;
    type?: string;
    maxLength?: number;
    required?: boolean;
    defaultValue?: string;
}

export default function AdminInput({
    name,
    placeholder = '',
    type = 'text',
    maxLength = 56,
    required = false,
    defaultValue = ''
}: AdminInputProps) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            required={required}
            defaultValue={defaultValue}
            className="admin-input"
        />
    );
}
