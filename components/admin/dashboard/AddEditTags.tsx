'use client';

//* --------------------------------------- //
//* -----------------IMPORTS--------------- //
//* --------------------------------------- //

//* STYLES
import styles from './AddEditTags.module.css';

//* ICONS
import { FiPlusCircle } from "react-icons/fi";

//* REACT
import { useEffect, useState } from "react";

//* TYPES
import { Mode, AdminAddEditModule } from "@/types/types";

//* COMPONENTS
import ScreenGuard from "@/components/general/ScreenGuard";
import InputSpinner from "@/components/general/InputSpinner";

import FormRow from "@/components/admin/formElements/FormRow";
import FieldModule from "@/components/admin/formElements/FieldModule";
import CloseButton from "@/components/admin/dashboard/CloseButton";

import AdminInput from "../formElements/AdminInput";
import AdminMultiSelect from "../formElements/AdminMultiSelect";
import UserSelect from "../formElements/UserSelect";
import IngredientSelect from "../formElements/IngredientSelect";
import AddEditHeader from "./AddEditHeader";

//* UTILS
import {
    seasonOptions,
    toTitleCase,
    handleModeSelectFactory,
    handleSeasonSelect,
    handleTagSelectFactory
} from "@/utils/utils";

//* HOOKS
import { useIngredientForm } from '@/hooks/useIngredientForm';
import useTagForm from '@/hooks/useTagForm';

//* CONTEXT
import { useDashboard } from '@/context/DashboardContext';
import Toggle2 from '@/components/general/Toggle2';
import TagDropSelect from '../formElements/TagDropSelect';



//* --------------------------------------- //
//* -----------------EXPORTS--------------- //
//* --------------------------------------- //

export default function AddEditTags({
    id,
    title,
    isActive,
    onClick,
    close
}: AdminAddEditModule) {


    //* -----------------STATES--------------- //

    const [mode, setMode] = useState<Mode>('add');

    const {
        formState, setFormState,
        handleSubmit,
        selectedTagAuthor,
        selectedTagUser,
        handleTagTypeSelect,
        tagOptions,
        handleTagAuthorSelect: handleAuthorSelect,
        handleTagUserSelect: handleUserSelect,
        handleTagAvailabilitySelect,
        error, successMsg, warningMsg, instructionMsg,
        submitWaiting,
        resetAll,
        isAddFormValid, isEditFormValid,
        isDisabled
    } = useTagForm(mode);

    const { } = useDashboard();

    const handleModeSelect = handleModeSelectFactory(setMode, resetAll);


    //* -----------------RETURN--------------- //

    return (
        <div
            className={`module ${styles['module']} ${isActive ? styles['active'] : styles['inactive']} ${styles['add-edit-ingredient-module']}`}
            onClick={onClick}
            id={id}
        >
            <header className={`${styles['module-header']} ${styles['header']}`}>
                <AddEditHeader
                    title={title}
                    active={isActive}
                    mode={mode}
                    error={error}
                    successMsg={successMsg}
                    warningMsg={warningMsg}
                    instructionMsg={instructionMsg}
                    handleModeSelect={handleModeSelect}
                />
            </header>

            {isActive && (
                <>
                    <div className={styles['add-edit-tag-body']}>
                        <form id="add-edit-tag" className="add-edit-tag" onSubmit={handleSubmit}>

                            {mode === 'edit' && (
                                // ROW 0: USER SELECT
                                <>
                                    <FormRow>
                                        <FieldModule label='user'>
                                            <UserSelect
                                                value={selectedTagUser}
                                                onSelect={handleUserSelect}
                                            />
                                        </FieldModule>
                                    </FormRow>

                                    {/* ROW 00: TAG SELECT */}
                                    <FormRow>
                                        <FieldModule label='tag'>
                                            <TagDropSelect
                                                disabled={!selectedTagUser}
                                                user={selectedTagUser}
                                                onSelect={(e) => console.log(e)}
                                                options={tagOptions}
                                            />
                                        </FieldModule>
                                    </FormRow>
                                </>
                            )}

                            {/* ROW 1: VALUE, TYPE */}
                            <FormRow>

                                <FieldModule label='tag value*'>
                                    <AdminInput
                                        name='tagValue'
                                        required={true}
                                        disabled={mode === 'edit' && isDisabled}
                                        className={`${mode === 'edit' && isDisabled && 'disabled'} full-length`}
                                        value={formState.value}
                                        onChange={e => setFormState({ ...formState, value: e.target.value })}
                                    />
                                </FieldModule>

                                <FieldModule label='tag type'>
                                    <Toggle2
                                        id='tag-type-assign'
                                        pos1='Ingredient'
                                        pos2='Recipe'
                                        value={formState.isIngredient}
                                        onChange={handleTagTypeSelect}
                                    />
                                </FieldModule>

                            </FormRow>

                            {/* ROW 2: USER, AVAILABILITY */}
                            <FormRow>
                                {mode === 'add' && (
                                    <FieldModule label="User*" className="add-edit-tag-user-module">
                                        <UserSelect
                                            value={selectedTagAuthor}
                                            disabled={formState.isDefaultTag}
                                            onSelect={handleAuthorSelect}
                                        />
                                    </FieldModule>
                                )}
                                <FieldModule label='availability'>
                                    <Toggle2
                                        id='tag-availability-assign'
                                        pos1='Default'
                                        pos2='User'
                                        value={formState.isDefaultTag}
                                        onChange={handleTagAvailabilitySelect}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow>
                                <FieldModule>
                                    <input
                                        disabled={mode === 'add' ? (submitWaiting || !isAddFormValid) : (submitWaiting || !isEditFormValid)}
                                        className={styles["add-edit-tag-submit"]}
                                        type="submit"
                                        value={toTitleCase(mode)}
                                    />
                                </FieldModule>
                            </FormRow>


                            <FormRow className='footnote'>
                                <div className="footnote-container"><span>* Required</span></div>
                            </FormRow>

                        </form>
                    </div>
                    <CloseButton onClick={(e) => { close(e); setMode('add'); resetAll() }} />
                </>
            )}

        </div>
    );
}