'use client';



//*--------------------------------------------//
//*------------------IMPORT--------------------//
//*--------------------------------------------//

import {
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";

import {
    UserFormState,
    Mode,
    ValidationObj,
    UserOption,
    UserFormStateEdit
} from "@/types/types";

import {
    useDashboard
} from "@/context/DashboardContext";

import {
    toTitleCase,
    createInputHandler,
    tagsIntoOptions,
    isPrintableAsciiOnly
} from "@/utils/utils";

import {
    comparePasswords,
    validatePassword,
    validateEmail
} from "@/utils/inputValidationUtils";



//*--------------------------------------------//
//*------------------EXPORT--------------------//
//*--------------------------------------------//

export default function useUserForm(mode: Mode) {



    //*----------------------------------------------//
    //*--------------------states--------------------//
    //*----------------------------------------------//

    const {
        refreshUsersModule,
    } = useDashboard();

    const emptyUserForm: UserFormState = {
        email: '',
        username: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        admin: false
    };

    const [isUserInfoLoading, setUserInfoLoading] = useState<boolean>(false);

    const [formState, setFormState] = useState<UserFormState>(emptyUserForm);

    const [submitWaiting, setSubmitWaiting] = useState(false);
    const [validationWaiting, setValidationWaiting] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [instructionMsg, setInstructionMsg] = useState<string | null>(null);

    const [selectedUserUserId, setSelectedUserUserId] = useState<number | null>(null);
    const [selectedUserInfo, setSelectedUserInfo] = useState<UserFormStateEdit>();
    const [userReady, setUserReady] = useState(false);

    const [confirmPasswordReady, setConfirmPasswordReady] = useState(false);
    const [passwordInvalidCondition, setPasswordInvalidCondition] = useState('');

    const [currentUserData, setCurrentUserData] = useState<UserFormStateEdit>();

    const [isDisabled, setIsDisabled] = useState<boolean>();

    //*-----------------------------------------------//
    //*-------------------functions-------------------//
    //*-----------------------------------------------//

    const clearStatuses = () => {
        setError(null);
        setSuccessMsg(null);
        setWarningMsg(null);
        setInstructionMsg(null);
    }

    const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isPrintableAsciiOnly(value) || value === '') {
            setFormState(prev => ({ ...prev, password: value }));
            const validity = validatePassword(value);

            clearStatuses();
            !validity.isValid
                ? setWarningMsg(validity.message)
                : setInstructionMsg('Confirm password');
            setConfirmPasswordReady(validity.isValid);
        }
    };

    const handleConfirmPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormState(prev => ({ ...prev, confirmPassword: value }));

        const passwordMatch = comparePasswords(formState.password, value);

        console.log(formState.password, formState.confirmPassword);

        clearStatuses();
        if (!passwordMatch.isValid) {
            setError(passwordMatch.message);
            setValidationWaiting(true);
        } else {
            setValidationWaiting(false);
        }
    }

    const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const asciiCode = e.key.charCodeAt(0);
        if (asciiCode < 33 || asciiCode > 126) {
            e.preventDefault();
        }
    };

    const handleAdminSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.checked);
        setFormState(prev => ({ ...prev, admin: e.target.checked }));
    }

    const handleUserSelect = (option: UserOption | null) => {
        resetAll();
        if (option) {
            setSelectedUserUserId(option.value);
        } else {
            setSelectedUserUserId(null);
        }
    }

    const resetAll = useCallback((exceptions?: string[]) => {
        !exceptions?.includes('error') && setError(null);
        !exceptions?.includes('success') && setSuccessMsg(null);
        !exceptions?.includes('warning') && setWarningMsg(null);
        !exceptions?.includes('instruction') && setInstructionMsg(null);
        !exceptions?.includes('userReady') && setUserReady(false);
        !exceptions?.includes('form') && setFormState(emptyUserForm);
        !exceptions?.includes('userId') && setSelectedUserUserId(null);
        !exceptions?.includes('validation') && setValidationWaiting(true);
        setConfirmPasswordReady(false);
    }, []);

    //* SUBMIT
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitWaiting(true);

        const emailValidity = validateEmail(formState.email);
        if (!emailValidity.isValid) {
            clearStatuses();
            setError(emailValidity.message);
            setSubmitWaiting(false);
            return;
        }

        if (mode === 'add') {

            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState)
            });

            clearStatuses();

            if (!res.ok) {
                const error = res.json();
                console.log(error);
                setError('error, check console');
            } else {
                setSuccessMsg('New user created!');
                refreshUsersModule();
                setFormState(emptyUserForm);
                setConfirmPasswordReady(false);
                setSelectedUserUserId(null);
            }

        } else if (mode === 'edit') {
            if (selectedUserUserId) {

                const res = await fetch(`/api/user/${selectedUserUserId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formState)
                });

                clearStatuses();

                if (!res.ok) {
                    const error = res.json();
                    console.log(error);
                    setError('error, check console');
                } else {
                    setFormState(emptyUserForm);
                    setSelectedUserUserId(null);
                    refreshUsersModule();
                    setConfirmPasswordReady(false);
                    setSuccessMsg('User updated!');
                }
            }
        }

        setSubmitWaiting(false);
    }



    //*------------------------------------------------//
    //*-------------------useEffects-------------------//
    //*------------------------------------------------//

    useEffect(() => {
        console.log(selectedUserUserId);
        clearStatuses();
        const getUserData = async () => {
            setUserInfoLoading(true);
            const res = await fetch(`api/user/${selectedUserUserId}`);

            if (!res.ok) {
                const error = res.json();
                setError('Error fetching user information.');
                console.log(error);
                return;
            }

            const data: UserFormStateEdit = await res.json();
            setCurrentUserData(data);
            setFormState({
                email: data.email,
                username: data.username || '',
                nickname: data.nickname || '',
                password: '',
                confirmPassword: '',
                admin: data.role === 'admin' ? true : false
            });
            setUserInfoLoading(false);
        }

        if (selectedUserUserId) {
            getUserData();
            setIsDisabled(false);
        } else {
            console.warn('disabling');
            setValidationWaiting(true);
            setIsDisabled(true);
        }

        clearStatuses();
    }, [selectedUserUserId]);


    // COMPARE USER INFO TO VALIDATE THE SUBMIT BUTTON => no change, no edit
    useEffect(() => {
        const handleCompareUserForm = (updatedUserData: UserFormState, currentUserData: UserFormStateEdit) => {
            if (
                updatedUserData.email !== currentUserData.email
                || updatedUserData.nickname !== currentUserData.nickname
                || updatedUserData.username !== currentUserData.username
                || updatedUserData.admin !== (currentUserData.role === 'admin' ? true : false)
            ) {
                console.warn('enabling');
                setValidationWaiting(false);
            } else {
                setValidationWaiting(true);
            }
        }

        if (currentUserData && mode === 'edit' && selectedUserUserId) {
            console.warn('comparing');
            handleCompareUserForm(formState, currentUserData);
        }
    }, [formState.email, formState.username, formState.nickname, formState.admin]);



    //*--------------------------------------------//
    //*-------------------return-------------------//
    //*--------------------------------------------//

    return {
        formState,
        setFormState,
        resetAll,
        error,
        successMsg,
        validationWaiting,
        submitWaiting,
        warningMsg,
        instructionMsg,
        confirmPasswordReady,
        handlePasswordKeyDown,
        handlePasswordInput,
        handleAdminSelect,
        handleUserSelect,
        handleConfirmPasswordInput,
        handleSubmit,
        isDisabled,
        isUserInfoLoading
    }
}