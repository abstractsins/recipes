//*--------------------------------------------//
//*------------------IMPORT--------------------//
//*--------------------------------------------//

import styles from './AddEditUser.module.css';

import { useEffect, useState } from 'react';

//* COMPONENTS
import AddEditHeader from './AddEditHeader';
import FormRow from "@/components/admin/formElements/FormRow";
import FieldModule from "@/components/admin/formElements/FieldModule";
import AdminInput from "../formElements/AdminInput";
import UserSelect from "../formElements/UserSelect";

import CloseButton from './CloseButton';
import ScreenGuard from '@/components/general/ScreenGuard';
import Toggle2 from '@/components/general/Toggle2';

//* CONTEXTS, HOOKS, TYPES, UTILS
import { useDashboard } from '@/context/DashboardContext';

import useUserForm from '@/hooks/useUserForm';

import { Mode, AdminAddEditModule } from '@/types/types';

import {
    toTitleCase,
    handleModeSelectFactory,
} from "@/utils/utils";
import InputSpinner from '@/components/general/InputSpinner';



//*--------------------------------------------//
//*------------------EXPORT--------------------//
//*--------------------------------------------//

export default function AddEditUser({ id, isActive, onClick, title, close }: AdminAddEditModule) {



    //*----------------------------------------------//
    //*--------------------states--------------------//
    //*----------------------------------------------//

    const [mode, setMode] = useState<Mode>('add');

    const {
        isUserInfoLoading,
    } = useDashboard();

    const {
        formState,
        setFormState,
        resetAll,
        error,
        successMsg,
        warningMsg,
        instructionMsg,
        submitWaiting,
        validationWaiting,
        confirmPasswordReady,
        handlePasswordKeyDown,
        handlePasswordInput,
        handleUserSelect,
        handleAdminSelect,
        handleConfirmPasswordInput,
        isDisabled,
        handleSubmit
    } = useUserForm(mode)

    const handleModeSelect = handleModeSelectFactory(setMode, resetAll);



    //*--------------------------------------------//
    //*-------------------return-------------------//
    //*--------------------------------------------//

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
                    <div className={styles['add-edit-user-body']}>
                        <form id="add-edit-recipe" className="add-edit-recipe" onSubmit={handleSubmit}>

                            {mode === 'edit' && (
                                <FormRow className={styles['row-0']}>
                                    <FieldModule label="User" id="edit-ingredient-user-module">
                                        <UserSelect onSelect={handleUserSelect} />
                                        {isUserInfoLoading && <InputSpinner />}
                                    </FieldModule>
                                </FormRow>
                            )}

                            <FormRow>
                                <FieldModule label='Email*'>
                                    <AdminInput
                                        name='email'
                                        required={true}
                                        disabled={mode === 'edit' && isDisabled}
                                        className={`${mode === 'edit' && isDisabled ? 'disabled' : ''}`}
                                        value={formState.email}
                                        onChange={e => setFormState({ ...formState, email: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow>
                                <FieldModule label='Username'>
                                    <AdminInput
                                        name='username'
                                        required={false}
                                        disabled={mode === 'edit' && isDisabled}
                                        className={`${mode === 'edit' && isDisabled ? 'disabled' : ''}`}
                                        value={formState.username}
                                        onChange={e => setFormState({ ...formState, username: e.target.value })}
                                    />
                                </FieldModule>

                                <FieldModule label='Nickname'>
                                    <AdminInput
                                        name='nickname'
                                        required={false}
                                        disabled={mode === 'edit' && isDisabled}
                                        className={`${mode === 'edit' && isDisabled ? 'disabled' : ''}`}
                                        value={formState.nickname}
                                        onChange={e => setFormState({ ...formState, nickname: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            {mode === 'add' &&
                                <FormRow>
                                    <FieldModule label='Password*'>
                                        <AdminInput
                                            name='password'
                                            type='password'
                                            required={true}
                                            value={formState.password}
                                            autoComplete="new-password"
                                            onKeyDown={handlePasswordKeyDown}
                                            onChange={handlePasswordInput}
                                        />
                                    </FieldModule>
                                    <FieldModule label='Confirm Password*'>
                                        <AdminInput
                                            name='confirmPassword'
                                            type='password'
                                            required={true}
                                            value={formState.confirmPassword}
                                            disabled={!confirmPasswordReady}
                                            className={`${mode} === 'edit' && isDisabled ? 'disabled' : ''}`}
                                            onKeyDown={handlePasswordKeyDown}
                                            onChange={handleConfirmPasswordInput}
                                        />
                                    </FieldModule>
                                </FormRow>
                            }

                            {mode === 'edit' &&
                                <FormRow>
                                    <FieldModule label='New Password'>
                                        <AdminInput
                                            name='newPassword'
                                            type='password'
                                            required={false}
                                            value={formState.password}
                                            autoComplete="new-password"
                                            disabled={isDisabled}
                                            className={`${isDisabled ? 'disabled' : ''}`}
                                            onKeyDown={handlePasswordKeyDown}
                                            onChange={handlePasswordInput}
                                        />
                                    </FieldModule>
                                    <FieldModule label='Confirm New Password'>
                                        <AdminInput
                                            name='confirmNewPassword'
                                            type='password'
                                            required={!!formState.password}
                                            value={formState.confirmPassword}
                                            disabled={!confirmPasswordReady}
                                            className={`${isDisabled ? 'disabled' : ''}`}
                                            onKeyDown={handlePasswordKeyDown}
                                            onChange={handleConfirmPasswordInput}
                                        />
                                    </FieldModule>
                                </FormRow>
                            }

                            <FormRow>
                                <FieldModule label='Permissions'>
                                    <Toggle2
                                        id='user-admin-assign'
                                        pos1='Admin'
                                        pos2='Regular'
                                        value={formState.admin}
                                        onChange={handleAdminSelect}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow>
                                <FieldModule>
                                    <input
                                        disabled={submitWaiting || validationWaiting}
                                        className={`${styles["add-edit-user-submit"]} ${submitWaiting || validationWaiting ? 'disabled' : ''}`}
                                        type="submit"
                                        value={toTitleCase(mode)}
                                    />
                                </FieldModule>
                            </FormRow>

                        </form>
                    </div>
                    <CloseButton onClick={(e) => { close(e); setMode('add'); resetAll() }} />
                </>
            )}

        </div>
    );
}