import styles from './AddEditUser.module.css';

import AddEditHeader from './AddEditHeader';
import FormRow from "@/components/admin/formElements/FormRow";
import FieldModule from "@/components/admin/formElements/FieldModule";
import AdminInput from "../formElements/AdminInput";
import UserSelect from "../formElements/UserSelect";

import CloseButton from './CloseButton';
import ScreenGuard from '@/components/general/ScreenGuard';

import { useDashboard } from '@/context/DashboardContext';
import { useEffect, useState } from 'react';
import useUserForm from '@/hooks/useUserForm';
import { Mode } from '@/types/types';

import {
    toTitleCase,
    handleModeSelectFactory,
} from "@/utils/utils";
import Toggle2 from '@/components/general/Toggle2';


interface Props {
    id: string;
    isActive: boolean;
    title: string;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    close: (e: React.MouseEvent<HTMLDivElement>) => void;
}


export default function AddEditUser({ id, isActive, onClick, title, close }: Props) {

    const { } = useDashboard();

    const [mode, setMode] = useState<Mode>('add');

    const {
        formState,
        setFormState,
        resetAll,
        error,
        statusMsg,
        submitWaiting,
        confirmPasswordReady,
        handlePasswordKeyDown,
        handlePasswordInput,
        selectedUserValue,
        handleUserSelect,
        handleAdminSelect,
        isDisabled,
        handleSubmit
    } = useUserForm(mode)

    const handleModeSelect = handleModeSelectFactory(setMode, resetAll);

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
                    statusMsg={statusMsg}
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
                                        <UserSelect value={selectedUserValue} onSelect={handleUserSelect} />
                                    </FieldModule>
                                </FormRow>
                            )}

                            <FormRow>
                                <FieldModule label='Email*'>
                                    <AdminInput
                                        name='email'
                                        required={true}
                                        disabled={isDisabled}
                                        className={`${isDisabled ? 'disabled' : ''}`}
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
                                        disabled={isDisabled}
                                        className={`${isDisabled ? 'disabled' : ''}`}
                                        value={formState.username}
                                        onChange={e => setFormState({ ...formState, username: e.target.value })}
                                    />
                                </FieldModule>

                                <FieldModule label='Nickname'>
                                    <AdminInput
                                        name='nickname'
                                        required={false}
                                        disabled={isDisabled}
                                        className={`${isDisabled ? 'disabled' : ''}`}
                                        value={formState.nickname}
                                        onChange={e => setFormState({ ...formState, nickname: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow>
                                <FieldModule label='Password*'>
                                    <AdminInput
                                        name='password'
                                        type='password'
                                        required={true}
                                        disabled={isDisabled}
                                        className={`${isDisabled ? 'disabled' : ''}`}
                                        onChange={handlePasswordInput}
                                        onKeyDown={handlePasswordKeyDown}
                                    />
                                </FieldModule>
                                <FieldModule label='Confirm Password*'>
                                    <AdminInput
                                        name='confirmPassword'
                                        type='password'
                                        required={true}
                                        disabled={!confirmPasswordReady}
                                        className={`${isDisabled ? 'disabled' : ''}`}
                                        onChange={e => setFormState({ ...formState, password: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow>
                                <FieldModule label='Permissions'>
                                    <Toggle2
                                        id='user-admin-assign'
                                        pos1='Admin'
                                        pos2='Regular'
                                        onChange={handleAdminSelect}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow>
                                <FieldModule>
                                    <input
                                        disabled={submitWaiting}
                                        className={styles["add-edit-user-submit"]}
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