// TODO
// collapse tag view

import React, { BlockquoteHTMLAttributes } from 'react';
import { AdminSelectProps, SeasonOption } from '@/types/types';

import { TagOption, Option } from '@/types/types';

export default function AdminSelect({
    name,
    options,
    disabled,
    id = '',
    isLoading,
    className = '',
    required = false,
    defaultValue,
    multiple = false,
    onChange
}: AdminSelectProps) {

    const toValue = (v: string | Option): string | undefined => typeof v === 'string' ? v : v.value;

    return (
        <>
            {!multiple
                ? (
                    <select
                        name={name}
                        id={id}
                        required={required}
                        defaultValue={typeof defaultValue === 'string' ? defaultValue : undefined}
                        className="admin-select"
                        multiple={multiple}
                    >
                        {options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                )
                : (<>
                    {isLoading
                        ? (
                            <>
                                <div className={`checkbox-container ${disabled ? 'disabled' : ''}`}>
                                    <label className={`skeleton`}></label>
                                </div>
                                <div className={`checkbox-container ${disabled ? 'disabled' : ''}`}>
                                    <label className={`skeleton`}></label>
                                </div>
                                <div className={`checkbox-container ${disabled ? 'disabled' : ''}`}>
                                    <label className={`skeleton`}></label>
                                </div>
                                <div className={`checkbox-container ${disabled ? 'disabled' : ''}`}>
                                    <label className={`skeleton`}></label>
                                </div>
                            </>
                        )
                        : (
                            options?.map((opt: TagOption | SeasonOption) => {

                                const checked = (
                                    defaultValue && 
                                    // typeof defaultValue !== 'string' &&
                                    typeof defaultValue[0] === 'number'
                                )
                                    && defaultValue.includes(opt.id ?? opt.value);

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
                                                autoComplete='off'
                                                checked={checked}
                                                disabled={disabled}
                                                key={opt.label}
                                                id={String(opt.id)}
                                                value={opt.value}
                                                type="checkbox"
                                                onChange={(e) => onChange(opt, e.target.checked)}
                                            />
                                            {opt.label}
                                        </label>
                                    </div>
                                )
                            })
                        )
                    }
                </>)
            }
        </>
    )
}
