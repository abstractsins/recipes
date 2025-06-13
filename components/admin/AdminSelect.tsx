import React, { BlockquoteHTMLAttributes } from 'react';

interface Option {
    value: string;
    label: string;
}

interface AdminSelectProps {
    name: string;
    options: Option[];
    required?: boolean;
    defaultValue?: string | [];
    multiple?: boolean;
    onChange: (value: string, checked: boolean) => void;
}

export default function AdminSelect({
    name,
    options,
    required = false,
    defaultValue = '',
    multiple = false,
    onChange
}: AdminSelectProps) {
    return (
        <>
            {!multiple
                ? (
                    <select
                        name={name}
                        required={required}
                        defaultValue={defaultValue}
                        className="admin-select"
                        multiple={multiple}
                    >
                        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                )
                : (<>
                    {options.map((opt) => (

                        <div key={opt.value + '-container'} className='checkbox-container'>
                            <label className={name} key={opt.value + '-label'}>
                                <input
                                    key={opt.value}
                                    value={opt.value}
                                    type="checkbox"
                                    onChange={(e) => onChange(opt.value, e.target.checked)}
                                />
                                {opt.label}
                            </label>
                        </div>
                    ))}
                </>)
            }
        </>
    )
}
