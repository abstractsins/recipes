// AdminMultiSelect.tsx
import React from 'react';
import { AdminMultiSelectProps, AdminOption } from '@/types/types';
import styles from './AdminMultiSelect.module.css';
import TagSkeletons from './TagSkeletons';

type ValueKey = 'id' | 'label' | 'value';

type Props = AdminMultiSelectProps & {
    valueKey?: ValueKey;
    emitPrimitive?: boolean;
};

export default function AdminMultiSelect({
    name,
    options,
    disabled,
    id = '',
    isLoading,
    className = '',
    required = false,
    defaultValue,
    onChange,
    valueKey = 'id',
}: Props) {
    const getPrimitive = (opt: AdminOption): string | number | undefined => {
        if (valueKey === 'id') return opt.id;
        if (valueKey === 'label') return opt.label;
        return opt.value ?? opt.id ?? opt.label;
    };

    const asString = (v: string | number | undefined) =>
        v === undefined ? '' : String(v);

    const isChecked = (opt: AdminOption) => {
        const prim = getPrimitive(opt);
        if (!Array.isArray(defaultValue)) return false;
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
                const inputId = `${opt.type}-${id || name}-${prim ?? opt.label}`;

                // click anywhere on the label to toggle
                const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
                    if (disabled) return;
                    if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') {
                        return;
                    }
                    // prevent the click from letting the input also fire *after* this
                    e.preventDefault();
                    onChange(opt, !checked);
                };

                return (
                    <div
                        id={id}
                        key={`${opt.label}-${prim}-container`}
                        className={`${styles['checkbox-container']} ${disabled ? 'disabled' : ''}`}
                    >
                        <label
                            htmlFor={inputId}
                            onClick={handleLabelClick}
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
                                value={prim ?? opt.label}
                                type="checkbox"
                                // keep this so keyboard / a11y still works
                                onChange={(e) => { onChange(opt, e.target.checked) }}
                            />
                            {opt.label}
                        </label>
                    </div>
                );
            })}
        </>
    );
}
