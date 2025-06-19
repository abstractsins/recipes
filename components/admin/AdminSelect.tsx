// TODO
// collapse tag view

import React, { BlockquoteHTMLAttributes } from 'react';
import { AdminSelectProps } from '@/types/types';

export default function AdminSelect({
    name,
    options,
    disabled,
    id = '',
    className = '',
    required = false,
    defaultValue,
    multiple = false,
    onChange
}: AdminSelectProps) {

    console.log(defaultValue);

    return (
        <>
            {!multiple
                ? (
                    <select
                        name={name}
                        id={id}
                        required={required}
                        defaultValue={defaultValue}
                        className="admin-select"
                        multiple={multiple}
                    >
                        {options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                )
                : (<>
                    {options?.map((opt) => {

                        const checked = defaultValue?.includes(opt.value);

                        return (
                            < div
                                id={id}
                                key={opt.value + '-container'}
                                className={`checkbox-container ${disabled ? 'disabled' : ''}`}
                            >
                                <label
                                    key={opt.value + '-label'}
                                    className={`${name} ${checked ? 'checked' : ''}`}
                                >
                                    <input
                                        checked={checked}
                                        disabled={disabled}
                                        key={opt.value}
                                        value={opt.value}
                                        type="checkbox"
                                        onChange={(e) => onChange(opt.value, e.target.checked)}
                                    />
                                    {opt.label}
                                </label>
                            </div>)
                    }

                    )}
                </>)
            }
        </>
    )
}
