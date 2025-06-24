'use client';

import FormRow from "@/components/admin/formElements/FormRow";
import FieldModule from "@/components/admin/formElements/FieldModule";
import CloseButton from "@/components/admin/dashboard/CloseButton";
import AdminInput from "@/components/admin/formElements/AdminInput";
import AdminSelect from "@/components/admin/formElements/AdminSelect";
import UserSelect from "@/components/admin/formElements/UserSelect";
import IngredientSelect from "@/components/admin/formElements/IngredientSelect";

import { useFetchUsers } from "@/hooks/useFetchUsers";
import { AdminReadoutModule } from "@/types/types";
import { useState } from "react";

import Loader from "@/components/general/Loader";
import ScreenGuard from "@/components/general/ScreenGuard";


export default function EditIngredient({
    className,
    onClick: activate,
    active,
    close
}: AdminReadoutModule) {

    const { users } = useFetchUsers();
    const [waiting, setIsWaiting] = useState(false);
    const [ingredientReady, setIngredientReady] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    }

    const handleUserSelect = async (selectedUser: string) => {
        console.log('Selected user id:', selectedUser);
        const selectedUserId: number = Number(selectedUser.split(':')[0]);
        
        selectedUserId && !isNaN(selectedUserId)
            ? setIngredientReady(true)
            : setIngredientReady(false);

    }

    return (
        <div className={`module ${className}`} id="edit-ingredient-module" onClick={activate}>

            <header>
                <h3>Edit Ingredient</h3>
            </header>

            {waiting && (
                <>
                    {/* <Loader msg="Submitting" /> */}
                    <ScreenGuard />
                </>
            )}

            {active && (
                <>
                    <div className="edit-ingredient-body">
                        <form id="edit-ingredient" onSubmit={handleSubmit}>

                            <FormRow id="row-1">
                                <FieldModule label="User" id="edit-ingredient-user-module">
                                    <UserSelect onSelect={handleUserSelect} />
                                </FieldModule>
                            </FormRow>

                            <FormRow id="row-2">
                                <FieldModule label="Ingredient" id="edit-ingredient-ingredient-module">
                                    <IngredientSelect ready={!ingredientReady} />
                                </FieldModule>
                            </FormRow>

                        </form>
                    </div>
                    <CloseButton onClick={close} />
                </>
            )}
        </div>
    );
}
