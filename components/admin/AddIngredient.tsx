'use client';

import { useEffect, useState } from "react";

import { User, AdminModule } from "@/types/types";

import CloseButton from "./CloseButton";

export default function AddingIngredient({ onClick: activate, active, close }: AdminModule) {

    const [users, setUsers] = useState<User[]>([]);;
    const [isLoading, setIsLoading] = useState(true);

    //* ------------------------------------------
    //* 👥 FETCH USERS // until data is shared with the one call
    //* ------------------------------------------
    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch('/api/user');
                const data: User[] = await res.json();
                // Sort right after receiving
                const sorted = data.sort((a, b) => Number(a.id) - Number(b.id));
                setUsers(sorted);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const submitIngredient = async (e: React.FormEvent<HTMLFormElement>) => {
        alert('fetch not written yet');
    }

    return (
        <div className="module inactive" id="add-ingredient-module" onClick={activate}>
            <header>
                <h3>Add Ingredient</h3>
            </header>
            {active &&
                (<>
                    <div className="add-ingredient-body">
                        <form id="add-ingredient" onSubmit={submitIngredient}>
                            <div className="row" id="row-1">
                                <input type="text" maxLength={56} name="name" placeholder="Name" />
                            </div>
                            <div className="row" id="row-2">
                                <input type="text" maxLength={56} name="main" placeholder="Main?" />
                                <input type="text" maxLength={56} name="variety" placeholder="Variety?" />
                            </div>
                            <div className="row" id="row-3">
                                <select name="season" defaultValue={'Season?'}>
                                    <option value={'null'}>Season?</option>
                                    <option value={'fall'}>Fall</option>
                                    <option value={'winter'}>Winter</option>
                                    <option value={'spring'}>Spring</option>
                                    <option value={'summer'}>Summer</option>
                                </select>
                            </div>
                            <div className="row" id="row-4">
                                <select name="user" defaultValue={'User'}>
                                    {
                                        users?.map(el => {
                                            return (
                                                <option key={el.id}>{`${el.id}, ${el.username} -- ${el.nickname} -- ${el.email}`}</option>
                                            )
                                        })
                                    }
                                </select>
                                <input type="submit" id="add-ingredient-submit" value={'Add'}></input>
                            </div>
                        </form>
                    </div>
                    <CloseButton onClick={close} />
                </>
                )}
        </div >
    );
}