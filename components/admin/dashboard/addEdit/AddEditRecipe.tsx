// TODO
//* 'error' status message
//* form compare for edits
//* keep user showing in dropdown after recipe add/edit

'use client';

//* --------------------------------------- //
//* -----------------IMPORTS--------------- //
//* --------------------------------------- //

//* STYLES
import styles from './AddEditRecipe.module.css';

//* ICONS
import { FiPlusCircle } from "react-icons/fi";

//* REACT
import { useState } from "react";

//* TYPES
import { Mode } from "@/types/types";

//* COMPONENTS
import ScreenGuard from "@/components/general/ScreenGuard";

import FormRow from "@/components/admin/formElements/FormRow";
import FieldModule from "@/components/admin/formElements/FieldModule";
import CloseButton from "@/components/admin/dashboard/CloseButton";

import AdminInput from "@/components/admin/formElements/AdminInput";
import AdminMultiSelect from "@/components/admin/formElements/AdminMultiSelect";
import TagsSelect from "@/components/admin/TagsSelect";
import UserSelect from "@/components/admin/formElements/UserSelect";
import RecipeIngredientsModule from '@/components/admin/formElements/addEditRecipe/RecipeIngredientsModule';

import AddEditHeader from "./AddEditHeader";

import RecipeSelect from '@/components/admin/formElements/RecipeSelect';
import IngredientAdd from '@/components/admin/formElements/addEditRecipe/IngredientAdd';

import InputSpinner from '@/components/general/InputSpinner';

//* UTILS
import {
    recipeSeasonOptions,
    toTitleCase,
    handleModeSelectFactory,
    handleSeasonSelect,
    handleTagSelectFactory,
} from "@/utils/utils";

//* HOOKS
import useRecipeForm from '@/hooks/useRecipeForm';

//* CONTEXT
import { useDashboard } from '@/context/DashboardContext';
import { RecIngProvider } from '@/context/RecipeIngredientContext';




//* --------------------------------------- //
//* ----------------INTERFACE-------------- //
//* --------------------------------------- //

interface Props {
    id: string;
    isActive: boolean;
    title: string;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}



//* --------------------------------------- //
//* -----------------EXPORTS--------------- //
//* --------------------------------------- //

export default function AddEditRecipe({
    id,
    isActive,
    onClick,
    title,
    close
}: Props) {


    //* -----------------STATES--------------- //

    const [mode, setMode] = useState<Mode>('add');

    const {
        defaultRecipeTagOptions,
        recipeListWaiting,
    } = useDashboard();

    const {
        formState, setFormState,
        resetAll,

        userRecipeList, recipeInfo,

        error, successMsg, warningMsg, instructionMsg,

        userRecipeTagValue,
        addUserRecipeTag,

        selectedRecipeId,
        selectedRecipeUserId,
        selectedRecipeUserValue,
        selectedUserRecipeTagOptions,

        handleRecipeSelect,
        handleRecipeUserSelect,
        userRecipeTagInputHandler,
        handleSubmit,

        userReady, recipeReady,
        isRecipeSelectReady, isIngredientModuleReady,
        userTagsWaiting, submitWaiting, isRecipeLoading,
        isDisabled
    } = useRecipeForm(mode);

    const handleModeSelect = handleModeSelectFactory(setMode, resetAll);
    const onSeasonChange = handleSeasonSelect(setFormState);
    const onDefaultTagChange = handleTagSelectFactory(setFormState, 'selectedDefaultTagIds');
    const onUserTagChange = handleTagSelectFactory(setFormState, 'selectedUserTagIds');


    //* -----------------RETURN--------------- //

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
                    <div className={styles['add-edit-recipe-body']}>
                        <form id="add-edit-recipe" className="add-edit-recipe" onSubmit={handleSubmit}>

                            <FormRow className={styles['row-0']}>
                                <FieldModule label="User" id="edit-recipe-user-module">
                                    <UserSelect onSelect={handleRecipeUserSelect} value={selectedRecipeUserValue} />
                                    {recipeListWaiting && <InputSpinner />}
                                </FieldModule>
                            </FormRow>

                            {mode === 'edit' && (
                                <FormRow className={styles['row-00']}>
                                    <FieldModule label="Recipe" id="edit-recipe-recipe-module">
                                        <RecipeSelect
                                            value={selectedRecipeId}
                                            data={userRecipeList}
                                            ready={!recipeListWaiting && isRecipeSelectReady}
                                            onSelect={handleRecipeSelect}
                                        />
                                        {isRecipeLoading && <InputSpinner />}
                                    </FieldModule>
                                </FormRow>
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

                            <FormRow id="row-1B">
                                <FieldModule label="Translation">
                                    <AdminInput
                                        name='translation'
                                        disabled={isDisabled}
                                        className={`${isDisabled ? 'disabled' : ''} optional`}
                                        placeholder={'optional...'}
                                        value={formState.translation}
                                        onChange={e => setFormState({ ...formState, translation: e.target.value })}

                                    />
                                </FieldModule>

                                <FieldModule label="Alternate Name">
                                    <AdminInput
                                        name='alt-name'
                                        disabled={isDisabled}
                                        className={`${isDisabled ? 'disabled' : ''} optional`}
                                        placeholder={'aka...'}
                                        value={formState.altName}
                                        onChange={e => setFormState({ ...formState, altName: e.target.value })}

                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-2']}>
                                <FieldModule className={`tags`} label="Season">
                                    <AdminMultiSelect
                                        name="season"
                                        disabled={isDisabled}
                                        valueKey='label'
                                        defaultValue={formState.selectedSeasons}
                                        multiple
                                        className={`tag`}
                                        onChange={onSeasonChange}
                                        options={recipeSeasonOptions}
                                    />
                                </FieldModule>
                            </FormRow>


                            {!isDisabled && isIngredientModuleReady &&
                                <RecIngProvider>
                                    <div className={styles["ingredients-module"]}>
                                        <RecipeIngredientsModule mode={mode} />
                                    </div>
                                </RecIngProvider>
                            }

                            <div className={styles["tags-module"]}>
                                <FormRow className={styles['row-5']}>
                                    <FieldModule label="Default-Tags">
                                        <TagsSelect
                                            name="default-tags"
                                            defaultValue={formState.selectedDefaultTagIds}
                                            disabled={isDisabled}
                                            onChange={onDefaultTagChange}
                                            multiple
                                            type="recipe"
                                            user={null}
                                            options={defaultRecipeTagOptions}
                                        />
                                    </FieldModule>
                                </FormRow>

                                {(selectedRecipeUserId) && (
                                    <>
                                        <FormRow className={styles["user-tags"]}>
                                            <FieldModule label="User-Tags">
                                                <TagsSelect
                                                    name="user-tags"
                                                    defaultValue={formState.selectedUserTagIds}
                                                    disabled={isDisabled}
                                                    onChange={onUserTagChange}
                                                    isLoading={userTagsWaiting}
                                                    multiple
                                                    type="recipe"
                                                    user={selectedRecipeUserId}
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

                            <FormRow className='footnote'>
                                <div className="footnote-container"><span>* Required</span></div>
                                <FieldModule className="add-edit-recipe-submit-module">
                                    <input
                                        disabled={submitWaiting}
                                        className={styles["add-edit-recipe-submit"]}
                                        type="submit"
                                        value={toTitleCase(mode)}
                                    />
                                </FieldModule>
                            </FormRow>

                        </form>
                    </div>
                    <CloseButton onClick={(e) => { close(e); setMode('add'); resetAll(); }} />
                </>
            )}

        </div>
    )


}