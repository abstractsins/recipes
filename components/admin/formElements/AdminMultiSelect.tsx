// TODO
// collapse tag view

import React, { BlockquoteHTMLAttributes } from 'react';
import {
    AdminMultiSelectProps,
    SeasonOption,
    UomOption,
    TagOption,
    AdminOption
} from '@/types/types';

import styles from './AdminMultiSelect.module.css';

import TagSkeletons from './TagSkeletons';

export default function AdminMultiSelect({
    name,
    options,
    disabled,
    id = '',
    isLoading,
    className = '',
    required = false,
    defaultValue = [],
    onChange
}: AdminMultiSelectProps) {

    return (
        <>
            {isLoading
                ? (className === 'tag' && <TagSkeletons />)
                : (
                    options?.map((opt: AdminOption) => {

                        const checked = defaultValue.includes(opt.id);

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


        </>
    )
}
