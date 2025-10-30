// AdminMultiSelect.tsx
import React from 'react';
import { AdminMultiSelectProps, AdminOption } from '@/types/types';
import styles from './AdminMultiSelect.module.css';
import TagSkeletons from './TagSkeletons';

type ValueKey = 'id' | 'label' | 'value';

type Props = AdminMultiSelectProps & {
    /** Which field to use for equality/checked comparison and (optionally) emit */
    valueKey?: ValueKey;               // default: 'id'
    /** If true, onChange receives the primitive value (id/label/value) instead of the whole option */
    emitPrimitive?: boolean;           // default: false
};

export default function AdminMultiSelect({
    name,
    options,
    disabled,
    id = '',
    isLoading,
    className = '',
    required = false, // (kept for compatibility, not used directly here)
    defaultValue,
    onChange,
    valueKey = 'id',
    emitPrimitive = false,
}: Props) {
    // Helper: extract the primitive according to valueKey
    const getPrimitive = (opt: AdminOption): string | number | undefined => {
        if (valueKey === 'id') return opt.id;
        if (valueKey === 'label') return opt.label;
        return opt.value ?? opt.id ?? opt.label; // 'value' fallback
    };

    // Normalize defaultValue for robust includes checks
    const asString = (v: string | number | undefined) =>
        v === undefined ? '' : String(v);

    const isChecked = (opt: AdminOption) => {
        const prim = getPrimitive(opt);
        if (!Array.isArray(defaultValue)) return false;
        // compare as strings to avoid 1 vs "1" mismatches from HTML values
        const needle = asString(prim);
        return defaultValue.map(asString).includes(needle);
    };

    if (isLoading) {
        return className === 'tag' ? <TagSkeletons /> : null;
    }

    return (
        <>
            {options?.map((opt: AdminOption) => {
                const checked = isChecked(opt);
                const prim = getPrimitive(opt);
                const inputId = `${id || name}-${prim ?? opt.label}`;

                return (
                    <div
                        id={id}
                        key={`${opt.label}-${prim}-container`}
                        className={`${styles['checkbox-container']} ${disabled ? 'disabled' : ''}`}
                    >
                        <label
                            htmlFor={inputId}
                            className={[
                                styles[name],
                                styles[className],
                                checked ? styles['checked'] : '',
                                disabled ? styles['disabled'] : '',
                                disabled ? 'disabled' : '',
                            ].join(' ')}
                        >
                            <input
                                autoComplete="off"
                                checked={checked}
                                disabled={disabled}
                                id={inputId}
                                // send a stable value for forms; we still rely on onChange below
                                value={prim ?? opt.label}
                                type="checkbox"
                                onChange={(e) => onChange(opt, e.target.checked)}
                            />
                            {opt.label}
                        </label>
                    </div>
                );
            })}
        </>
    );
}
