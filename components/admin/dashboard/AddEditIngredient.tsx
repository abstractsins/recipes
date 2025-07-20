'use client';

import styles from './AddEditIngredient.module.css';
import { FiPlusCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Mode, AdminAddEditModule } from "@/types/types";

import ScreenGuard from "@/components/general/ScreenGuard";
import InputSpinner from "@/components/general/InputSpinner";

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




export default function AddEditIngredient({ id, title, isActive, onClick, close }: AdminAddEditModule) {

    const [mode, setMode] = useState<Mode>('add');

    const {
        defaultIngredientTagOptions,
        isIngredientInfoLoading,
        ingredientListWaiting
    } = useDashboard();

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
        error, successMsg, warningMsg, instructionMsg,
        resetAll,
        userTagsWaiting,
        submitWaiting,
        ingredientInfo,
        userIngredientListHasLoaded
    } = useIngredientForm(mode);

    const ingredientSelectReady = (ingredientListWaiting === false && !!userIngredientList);
    const ingredientInfoReady = (isIngredientInfoLoading === false && !!ingredientInfo && ingredientSelectReady);
    const ingredientEditDisabled = mode === 'edit' && !ingredientInfoReady;

    const handleModeSelect = handleModeSelectFactory(setMode, resetAll);
    const onSeasonChange = handleSeasonSelect(setFormState);
    const onDefaultTagChange = handleTagSelectFactory(setFormState, 'selectedDefaultTagIndexes');
    const onUserTagChange = handleTagSelectFactory(setFormState, 'selectedUserTagIndexes');

    useEffect(() => {
        console.log('userIngredientListHasLoaded:', userIngredientListHasLoaded);
    }, [])


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
                                            {ingredientListWaiting && <InputSpinner />}
                                        </FieldModule>
                                    </FormRow>

                                    <FormRow className={styles['row-00']}>
                                        <FieldModule label="Ingredient" id="edit-ingredient-ingredient-module">
                                            <IngredientSelect
                                                value={selectedIngredientId}
                                                data={userIngredientList}
                                                ready={ingredientSelectReady}
                                                onSelect={handleIngredientSelect}
                                            />
                                            {isIngredientInfoLoading && <InputSpinner />}

                                        </FieldModule>
                                    </FormRow>
                                </>
                            )}

                            <FormRow id="row-1">
                                <FieldModule label="Name*">
                                    <AdminInput
                                        name="name"
                                        required
                                        disabled={ingredientEditDisabled}
                                        className={`${ingredientEditDisabled ? 'disabled' : ''}`}
                                        placeholder={mode === 'add' ? "e.g. Fingerling Potatoes" : ''}
                                        value={formState.name}
                                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-2']}>
                                <FieldModule className={`tags`} label="Season">
                                    <AdminMultiSelect
                                        name="season"
                                        disabled={ingredientEditDisabled}
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
                                        disabled={ingredientEditDisabled}
                                        value={formState.main}
                                        placeholder={mode === 'add' ? "e.g. Potato" : ''}
                                        className={`${ingredientEditDisabled ? 'disabled' : ''} optional`}
                                        onChange={e => setFormState({ ...formState, main: e.target.value })}
                                    />
                                </FieldModule>
                                <FieldModule label="Variety">
                                    <AdminInput
                                        name="variety"
                                        disabled={ingredientEditDisabled}
                                        value={formState.variety}
                                        placeholder={mode === 'add' ? "e.g. Fingerling" : ''}
                                        className={`${ingredientEditDisabled ? 'disabled' : ''} optional`}
                                        onChange={e => setFormState({ ...formState, variety: e.target.value })}
                                    />
                                </FieldModule>
                                <FieldModule className={`tags`} label="Preferred Brand">
                                    <AdminInput
                                        name="brand"
                                        disabled={ingredientEditDisabled}
                                        value={formState.brand}
                                        placeholder={mode === 'add' ? 'e.g. Heinz' : ''}
                                        className={`${ingredientEditDisabled ? 'disabled' : ''} optional`}
                                        onChange={e => setFormState({ ...formState, brand: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-4']}>
                                <FieldModule label="Category">
                                    <AdminInput
                                        name="category"
                                        disabled={ingredientEditDisabled}
                                        value={formState.category}
                                        placeholder={mode === 'add' ? "e.g. Vegetable" : ''}
                                        className={`${ingredientEditDisabled ? 'disabled' : ''} optional`}
                                        onChange={e => setFormState({ ...formState, category: e.target.value })}
                                    />
                                </FieldModule>
                                <FieldModule label="Sub Category">
                                    <AdminInput
                                        name="subcategory"
                                        disabled={ingredientEditDisabled}
                                        value={formState.subcategory}
                                        placeholder={mode === 'add' ? "e.g. Root" : ''}
                                        className={`${ingredientEditDisabled ? 'disabled' : ''} optional`}
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
                                            disabled={ingredientEditDisabled}
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
                                                    disabled={ingredientEditDisabled}
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
