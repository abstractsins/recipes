'use client';

import FormRow from "@/components/FormRow";
import FieldModule from "@/components/FieldModule";
import CloseButton from "@/components/admin/CloseButton";
import AdminInput from "./AdminInput";
import AdminSelect from "./AdminSelect";

import { useFetchUsers } from "@/hooks/useFetchUsers";
import { AdminModule } from "@/types/types";
import { useState } from "react";

import Loader from "../Loader";

export default function AddingIngredient({ className, onClick: activate, active, close }: AdminModule) {

    const { users } = useFetchUsers();
    const [waiting, setIsWaiting] = useState(false);
    const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
    const [error, setError] = useState('');

    const handleSeasonSelect = (value: string, checked: boolean) => {
        if (checked) {
            setSelectedSeasons(prev => [...prev, value]);
        } else {
            setSelectedSeasons(prev => prev.filter(s => s !== value));
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsWaiting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            name: formData.get('name'),
            mainClass: formData.get('mainClass'),
            variety: formData.get('variety'),
            category: formData.get('category'),
            subCategory: formData.get('subCategory'),
            userId: formData.get('user'),
            seasons: selectedSeasons,
        };

        console.log(data); // verify before sending

        try {
            const res = await fetch('/api/ingredient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!res.ok) {
                const error = await res.json();
                setError(error.error);
                console.error(error.error);
            } else {
                const json = await res.json();
                console.log('Ingredient created:', json);
            }

        } catch (err: any) {
            console.error('caught error: ' + err);
        } finally {
            setIsWaiting(false);
        }
    };
    return (
        <div className={`module ${className}`} id="add-ingredient-module" onClick={activate}>
            <header>
                <h3>Add Ingredient</h3>
                {active &&
                    <div className="error">
                        {error && <span>🍓 {error}</span>}
                    </div>
                }
            </header>

            {waiting && (
                <>
                    {/* <Loader msg="Submitting" /> */}
                    <div className="screen-guard"></div>
                </>
            )}

            {active && (
                <>
                    <div className="add-ingredient-body">
                        <form id="add-ingredient" onSubmit={handleSubmit}>

                            <FormRow id="row-1">
                                <FieldModule label="Name*" id="add-ingredient-name-module">
                                    <AdminInput name="name" placeholder="e.g. Fingerling Potatoes" required />
                                </FieldModule>
                            </FormRow>

                            <FormRow id="row-2">
                                <FieldModule label="Season">
                                    <AdminSelect
                                        name="season"
                                        defaultValue={[]}
                                        multiple={true}
                                        onChange={handleSeasonSelect}
                                        options={[
                                            { value: 'fall', label: 'Fall' },
                                            { value: 'winter', label: 'Winter' },
                                            { value: 'spring', label: 'Spring' },
                                            { value: 'summer', label: 'Summer' }
                                        ]}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow id="row-3">
                                <FieldModule label="Main Class">
                                    <input type="text" maxLength={56} name="main" placeholder="e.g. Potato" />
                                </FieldModule>

                                <FieldModule label="Variety">
                                    <input type="text" maxLength={56} name="variety" placeholder="e.g. Fingerling" />
                                </FieldModule>
                            </FormRow>

                            <FormRow id="row-4">
                                <FieldModule label="Category">
                                    <input type="text" maxLength={56} name="category" placeholder="e.g. Vegetable" />
                                </FieldModule>

                                <FieldModule label="Sub Category">
                                    <input type="text" maxLength={56} name="subcategory" placeholder="e.g. Starch" />
                                </FieldModule>
                            </FormRow>

                            <FormRow id="row-5">
                                <FieldModule label="User*" id="add-ingredient-user-module">
                                    <select className="admin-select" name="user" defaultValue={'User'}>
                                        <option value="null" label="Select User"></option>
                                        {users.map(el => (
                                            <option key={el.id}>{`${el.id}: ${el.username} -- ${el.nickname}, ${el.email}`}</option>
                                        ))}
                                    </select>
                                </FieldModule>

                                <FieldModule id="add-ingredient-submit-module">
                                    <input disabled={waiting} className={waiting ? 'disabled' : ''} type="submit" id="add-ingredient-submit" value="Add" />
                                </FieldModule>
                            </FormRow>

                            <FormRow id="row-6">
                                <div className="footnote-container">
                                    <span>* Required</span>
                                </div>
                            </FormRow>

                        </form>
                    </div>
                    <CloseButton onClick={(e)=>{close(e); setError('')}} />
                </>
            )}
        </div>
    );
}
