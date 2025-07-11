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
import AdminMultiSelect from "../formElements/AdminMultiSelect";
import TagsSelect from "../TagsSelect";
import UserSelect from "../formElements/UserSelect";
import IngredientSelect from "../formElements/IngredientSelect";
import AddEditHeader from "./AddEditHeader";

import {
    seasonOptions,
    toTitleCase,
    handleModeSelectFactory,
    handleSeasonSelect,
    handleTagSelectFactory
} from "@/utils/utils";

import { useIngredientForm } from '@/hooks/useIngredientForm';
import { useDashboard } from '@/context/DashboardContext';



interface Props {
    id: string;
    isActive: boolean;
    title: string;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}


export default function AddEditIngredient({ id, title, isActive, onClick, close }: Props) {

    const [mode, setMode] = useState<Mode>('add');

    const {
        formState,
        setFormState,
        handleIngredientSelect,
        handleIngredientUserSelect,
        handleAuthorSelect,
        userIngredientTagValue,
        userIngredientTagInputHandler,
        selectedUserIngredientTagOptions,
        addUserIngredientTag,
        handleSubmit,
        selectedAuthorId,
        selectedIngredientUserId,
        selectedIngredientUserValue,
        selectedIngredientId,
        userIngredientList,
        statusMsg,
        error,
        isDisabled,
        resetAll,
        userTagsWaiting,
        submitWaiting
    } = useIngredientForm(mode);

    const {
        defaultIngredientTagOptions,
        ingredientListWaiting,
    } = useDashboard();


    const handleModeSelect = handleModeSelectFactory(setMode, resetAll);
    const onSeasonChange = handleSeasonSelect(setFormState);
    const onDefaultTagChange = handleTagSelectFactory(setFormState, 'selectedDefaultTagIndexes');
    const onUserTagChange = handleTagSelectFactory(setFormState, 'selectedUserTagIndexes');



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
                    statusMsg={statusMsg}
                    handleModeSelect={handleModeSelect}
                />
            </header>

            {submitWaiting && <ScreenGuard />}
            {isActive && (
                <>
                    <div className={styles['add-edit-ingredient-body']}>
                        <form id="add-edit-ingredient" className="add-edit-ingredient" onSubmit={handleSubmit}>

                            {mode === 'edit' && (
                                <>
                                    <FormRow className={styles['row-0']}>
                                        <FieldModule label="User" id="edit-ingredient-user-module">
                                            <UserSelect value={selectedIngredientUserValue} onSelect={handleIngredientUserSelect} />
                                        </FieldModule>
                                    </FormRow>

                                    <FormRow className={styles['row-00']}>
                                        <FieldModule label="Ingredient" id="edit-ingredient-ingredient-module">
                                            <IngredientSelect
                                                value={selectedIngredientId}
                                                data={userIngredientList}
                                                ready={!ingredientListWaiting && !!selectedIngredientUserId}
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
                                    <AdminMultiSelect
                                        name="season"
                                        disabled={isDisabled}
                                        defaultValue={formState.selectedSeasonIndexes}
                                        multiple
                                        className={`tag`}
                                        onChange={onSeasonChange}
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
                                        className={`${isDisabled ? 'disabled' : ''} optional`}
                                        onChange={e => setFormState({ ...formState, main: e.target.value })}
                                    />
                                </FieldModule>
                                <FieldModule label="Variety">
                                    <AdminInput
                                        name="variety"
                                        disabled={isDisabled}
                                        value={formState.variety}
                                        placeholder="e.g. Fingerling"
                                        className={`${isDisabled ? 'disabled' : ''} optional`}
                                        onChange={e => setFormState({ ...formState, variety: e.target.value })}
                                    />
                                </FieldModule>
                                <FieldModule className={`tags`} label="Preferred Brand">
                                    <AdminInput
                                        name="brand"
                                        disabled={isDisabled}
                                        value={formState.brand}
                                        placeholder='e.g. Heinz'
                                        className={`${isDisabled ? 'disabled' : ''} optional`}
                                        onChange={e => setFormState({ ...formState, brand: e.target.value })}
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
                                        className={`${isDisabled ? 'disabled' : ''} optional`}
                                        onChange={e => setFormState({ ...formState, category: e.target.value })}
                                    />
                                </FieldModule>
                                <FieldModule label="Sub Category">
                                    <AdminInput
                                        name="subcategory"
                                        disabled={isDisabled}
                                        value={formState.subcategory}
                                        placeholder="e.g. Root"
                                        className={`${isDisabled ? 'disabled' : ''} optional`}
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
                                            onChange={onDefaultTagChange}
                                            multiple
                                            type="ingredient"
                                            user={null}
                                            options={defaultIngredientTagOptions}
                                        />
                                    </FieldModule>
                                </FormRow>

                                {(selectedIngredientUserId || selectedAuthorId) && (
                                    <>
                                        <FormRow className={styles["user-tags"]}>
                                            <FieldModule label="User-Tags">
                                                <TagsSelect
                                                    name="user-tags"
                                                    defaultValue={formState.selectedUserTagIndexes}
                                                    disabled={isDisabled}
                                                    onChange={onUserTagChange}
                                                    isLoading={userTagsWaiting}
                                                    multiple
                                                    type="ingredient"
                                                    user={selectedAuthorId ?? selectedIngredientUserId}
                                                    options={selectedUserIngredientTagOptions}
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
                                    <input disabled={submitWaiting} className={styles["add-edit-ingredient-submit"]} type="submit" value={toTitleCase(mode)} />
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
