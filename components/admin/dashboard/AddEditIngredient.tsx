'use client';

import styles from './AddEditIngredient.module.css';
import { FiPlusCircle } from "react-icons/fi";
import { useState } from "react";
import { Mode } from "@/types/types";

import ScreenGuard from "@/components/general/ScreenGuard";

import FormRow from "@/components/admin/formElements/FormRow";
import FieldModule from "@/components/admin/formElements/FieldModule";
import CloseButton from "@/components/admin/dashboard/CloseButton";

import AdminInput from "../formElements/AdminInput";
import AdminSelect from "../formElements/AdminSelect";
import TagsSelect from "../TagsSelect";
import UserSelect from "../formElements/UserSelect";
import IngredientSelect from "../formElements/IngredientSelect";
import AddEditIngredientHeader from "./AddEditIngredientHeader";

import { seasonOptions, toTitleCase } from "@/utils/utils";

import { useIngredientForm } from '@/hooks/useIngredientForm';

interface Props {
    id: string;
    isActive: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function AddEditIngredient({ id, isActive, onClick, close }: Props) {

    const [mode, setMode] = useState<Mode>('add');

    const {
        formState, setFormState,
        handleSeasonSelect,
        handleDefaultTagSelect,
        handleUserTagSelect,
        handleIngredientSelect,
        handleUserSelect,
        handleAuthorSelect,
        userIngredientTagValue,
        userIngredientTagInputHandler,
        addUserIngredientTag,
        handleSubmit,
        selectedAuthorId,
        selectedUserId,
        selectedIngredientId,
        userIngredientList,
        userTagsRefreshKey,
        statusMsg, error,
        isDisabled, waiting, resetAll
    } = useIngredientForm(mode);

    const handleModeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMode(e.target.checked ? 'edit' : 'add');
        resetAll();
    };

    return (
        <div
            className={`module ${styles['module']} ${isActive ? styles['active'] : styles['inactive']} ${styles['add-edit-ingredient-module']}`}
            onClick={onClick}
            id={id}
        >
            <header className={`${styles['module-header']} ${styles['header']}`}>
                <AddEditIngredientHeader
                    active={isActive}
                    mode={mode}
                    error={error}
                    statusMsg={statusMsg}
                    handleModeSelect={handleModeSelect}
                />
            </header>

            {waiting && <ScreenGuard />}
            {isActive && (
                <>
                    <div className={styles['add-edit-ingredient-body']}>
                        <form id="add-edit-ingredient" className="add-edit-ingredient" onSubmit={handleSubmit}>

                            {mode === 'edit' && (
                                <>
                                    <FormRow className={styles['row-0']}>
                                        <FieldModule label="User" id="edit-ingredient-user-module">
                                            <UserSelect onSelect={handleUserSelect} />
                                        </FieldModule>
                                    </FormRow>

                                    <FormRow className={styles['row-00']}>
                                        <FieldModule label="Ingredient" id="edit-ingredient-ingredient-module">
                                            <IngredientSelect
                                                value={selectedIngredientId}
                                                data={userIngredientList}
                                                ready={!!selectedUserId}
                                                onSelect={handleIngredientSelect}
                                            />
                                        </FieldModule>
                                    </FormRow>
                                </>
                            )}

                            <FormRow id="row-1">
                                <FieldModule label="Name*">
                                    <AdminInput
                                        name="name"
                                        required
                                        disabled={isDisabled}
                                        className={`${isDisabled ? 'disabled' : ''}`}
                                        placeholder="e.g. Fingerling Potatoes"
                                        value={formState.name}
                                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-2']}>
                                <FieldModule className={`tags`} label="Season">
                                    <AdminSelect
                                        name="season"
                                        disabled={isDisabled}
                                        defaultValue={formState.selectedSeasonIndexes}
                                        multiple
                                        className={`tag`}
                                        onChange={handleSeasonSelect}
                                        options={seasonOptions}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-3']}>
                                <FieldModule label="Main Class">
                                    <AdminInput
                                        name="main"
                                        disabled={isDisabled}
                                        value={formState.main}
                                        placeholder="e.g. Potato"
                                        className={`${isDisabled ? 'disabled' : ''}`}
                                        onChange={e => setFormState({ ...formState, main: e.target.value })}
                                    />
                                </FieldModule>
                                <FieldModule label="Variety">
                                    <AdminInput
                                        name="variety"
                                        disabled={isDisabled}
                                        value={formState.variety}
                                        placeholder="e.g. Fingerling"
                                        className={`${isDisabled ? 'disabled' : ''}`}
                                        onChange={e => setFormState({ ...formState, variety: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-4']}>
                                <FieldModule label="Category">
                                    <AdminInput
                                        name="category"
                                        disabled={isDisabled}
                                        value={formState.category}
                                        placeholder="e.g. Vegetable"
                                        className={`${isDisabled ? 'disabled' : ''}`}
                                        onChange={e => setFormState({ ...formState, category: e.target.value })}
                                    />
                                </FieldModule>
                                <FieldModule label="Sub Category">
                                    <AdminInput
                                        name="subcategory"
                                        disabled={isDisabled}
                                        value={formState.subcategory}
                                        placeholder="e.g. Root"
                                        className={`${isDisabled ? 'disabled' : ''}`}
                                        onChange={e => setFormState({ ...formState, subcategory: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            <div className={styles["tags-module"]}>
                                <FormRow className={styles['row-5']}>
                                    <FieldModule label="Default-Tags">
                                        <TagsSelect
                                            name="default-tags"
                                            defaultValue={formState.selectedDefaultTagIndexes}
                                            disabled={isDisabled}
                                            onChange={handleDefaultTagSelect}
                                            multiple
                                            type="ingredient"
                                            user={null}
                                        />
                                    </FieldModule>
                                </FormRow>

                                {(selectedUserId || selectedAuthorId) && (
                                    <>
                                        <FormRow className={styles["user-tags"]}>
                                            <FieldModule label="User-Tags">
                                                <TagsSelect
                                                    name="user-tags"
                                                    defaultValue={formState.selectedUserTagIndexes}
                                                    disabled={isDisabled}
                                                    onChange={handleUserTagSelect}
                                                    multiple
                                                    type="ingredient"
                                                    user={selectedAuthorId ?? selectedUserId}
                                                    refreshKey={userTagsRefreshKey}
                                                />
                                            </FieldModule>
                                        </FormRow>

                                        <FormRow className={styles["add-tags"]}>
                                            <FieldModule label="Add-Tags">
                                                <AdminInput
                                                    name="add-user-ingredient-tag"
                                                    className="quick-input"
                                                    placeholder="Buy Bulk..."
                                                    onChange={userIngredientTagInputHandler}
                                                    value={userIngredientTagValue}
                                                />
                                                <div
                                                    className={`${styles["plus-circle-container"]} ${styles['dark']}`}
                                                    onClick={addUserIngredientTag}
                                                >
                                                    <FiPlusCircle />
                                                </div>
                                            </FieldModule>
                                        </FormRow>
                                    </>
                                )}
                            </div>

                            <FormRow className={`${mode === 'edit' ? 'padding-top-20' : ''}`}>
                                {mode === 'add' && (
                                    <FieldModule label="User*" className="add-edit-ingredient-user-module">
                                        <UserSelect onSelect={handleAuthorSelect} />
                                    </FieldModule>
                                )}
                                <FieldModule className="add-edit-ingredient-submit-module">
                                    <input disabled={waiting} className={styles["add-edit-ingredient-submit"]} type="submit" value={toTitleCase(mode)} />
                                </FieldModule>
                            </FormRow>

                            <FormRow className='footnote'>
                                <div className="footnote-container"><span>* Required</span></div>
                            </FormRow>
                        </form>
                    </div>
                    <CloseButton onClick={(e) => { close(e); setMode('add'); resetAll()}} />
                </>
            )}
        </div>
    );
}
