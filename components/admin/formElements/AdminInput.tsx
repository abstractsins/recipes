import React from 'react';

interface AdminInputProps {
    name: string;
    placeholder?: string;
    type?: string;
    maxLength?: number;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    value?: string | string[];
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function AdminInput({
    name,
    className = '',
    placeholder = '',
    type = 'text',
    maxLength = 56,
    required = false,
    disabled = false,
    value,
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
            className={`admin-input ${className}`}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
    );
}
