// TODO
// collapse tag view

import React, { BlockquoteHTMLAttributes } from 'react';
import { AdminSelectProps, SeasonOption } from '@/types/types';

import { TagOption, Option } from '@/types/types';

import styles from './AdminSelect.module.css';

import TagSkeletons from './TagSkeletons';

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
                        className={styles["admin-select"]}
                    >
                        {options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                )
                : (<>
                    {isLoading
                        ? (className === 'tag' && <TagSkeletons />)
                        : (
                            options?.map((opt: TagOption | SeasonOption) => {

                                const checked = defaultValue?.includes(opt.id);

                                return (
                                    < div
                                        id={id}
                                        key={opt.value + '-container'}
                                        className={`${styles['checkbox-container']} ${disabled ? 'disabled' : ''}`}
                                    >
                                        <label
                                            key={opt.value + '-label'}
                                            className={`${styles[name]} ${styles[className]} ${checked ? styles['checked'] : ''} ${disabled ? styles['disabled'] : ''} ${disabled ? 'disabled' : ''}`}
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
