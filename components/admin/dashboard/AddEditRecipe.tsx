'use client';

import styles from './AddEditRecipe.module.css';
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
// import RecipeSelect from "../formElements/RecipeSelect";
import AddEditHeader from "./AddEditHeader";

import RecipeSelect from '../formElements/RecipeSelect';

import {
    seasonOptions,
    toTitleCase,
    handleModeSelectFactory,
    handleSeasonSelect,
    handleTagSelectFactory,
} from "@/utils/utils";

import { useDashboard } from '@/context/DashboardContext';
import useRecipeForm from '@/hooks/useRecipeForm';



interface Props {
    id: string;
    isActive: boolean;
    title: string;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}


export default function AddEditRecipe({ id, isActive, onClick, title, close }: Props) {

    const [mode, setMode] = useState<Mode>('add');

    const {
        defaultRecipeTagOptions,
        recipeListWaiting,
    } = useDashboard();


    const {
        formState,
        setFormState,
        handleAuthorSelect,
        selectedRecipeId,
        selectedRecipeUserId,
        selectedUserRecipeTagOptions,
        selectedAuthorId,
        userRecipeList,
        handleRecipeUserSelect,
        handleRecipeSelect,
        userRecipeTagInputHandler,
        userRecipeTagValue,
        addUserRecipeTag,
        isDisabled,
        handleSubmit,
        submitWaiting,
        userTagsWaiting,
        resetAll,
    } = useRecipeForm(mode);

    const handleModeSelect = handleModeSelectFactory(setMode, resetAll);
    const onSeasonChange = handleSeasonSelect(setFormState);
    const onDefaultTagChange = handleTagSelectFactory(setFormState, 'selectedDefaultTagIndexes');
    const onUserTagChange = handleTagSelectFactory(setFormState, 'selectedUserTagIndexes');

    return (
        <div
            className={`module ${styles['module']} ${isActive ? styles['active'] : styles['inactive']} ${styles['add-edit-recipe-module']}`}
            onClick={onClick}
            id={id}
        >
            <header className={`${styles['module-header']} ${styles['header']}`}>
                <AddEditHeader
                    title={title}
                    active={isActive}
                    mode={mode}
                    error={undefined}
                    statusMsg={undefined}
                    handleModeSelect={handleModeSelect}
                />
            </header>

            {submitWaiting && <ScreenGuard />}
            {isActive && (
                <>
                    <div className={styles['add-edit-recipe-body']}>
                        <form id="add-edit-recipe" className="add-edit-recipe" onSubmit={handleSubmit}>

                            {mode === 'edit' && (
                                <>
                                    <FormRow className={styles['row-0']}>
                                        <FieldModule label="User" id="edit-recipe-user-module">
                                            <UserSelect onSelect={handleRecipeUserSelect} />
                                        </FieldModule>
                                    </FormRow>

                                    <FormRow className={styles['row-00']}>
                                        <FieldModule label="Recipe" id="edit-recipe-recipe-module">
                                            <RecipeSelect
                                                value={selectedRecipeId}
                                                data={userRecipeList}
                                                ready={!recipeListWaiting && !!selectedRecipeUserId}
                                                onSelect={handleRecipeSelect}
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
                                        placeholder="e.g. Baked Penne"
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
                                        onChange={onSeasonChange}
                                        options={seasonOptions}
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
                                            type="recipe"
                                            user={null}
                                            options={defaultRecipeTagOptions}
                                        />
                                    </FieldModule>
                                </FormRow>

                                {(selectedRecipeUserId || selectedAuthorId) && (
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
                                                    type="recipe"
                                                    user={selectedAuthorId ?? selectedRecipeUserId}
                                                    options={selectedUserRecipeTagOptions}
                                                />
                                            </FieldModule>
                                        </FormRow>

                                        <FormRow className={styles["add-tags"]}>
                                            <FieldModule label="Add-Tags">
                                                <AdminInput
                                                    name="add-user-recipe-tag"
                                                    className="quick-input"
                                                    placeholder="Buy Bulk..."
                                                    onChange={userRecipeTagInputHandler}
                                                    value={userRecipeTagValue}
                                                />
                                                <div
                                                    className={`${styles["plus-circle-container"]} ${styles['dark']}`}
                                                    onClick={addUserRecipeTag}
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
                                    <FieldModule label="User*" className="add-edit-recipe-user-module">
                                        <UserSelect onSelect={handleAuthorSelect} />
                                    </FieldModule>
                                )}
                                <FieldModule className="add-edit-recipe-submit-module">
                                    <input
                                        disabled={submitWaiting}
                                        className={styles["add-edit-recipe-submit"]}
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
    )


}