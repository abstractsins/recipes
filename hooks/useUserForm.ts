'use client';

import {
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";

import {
    UserFormState,
    Mode
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
    validatePassword,
    validateEmail
} from "@/utils/inputValidationUtils";



export default function useUserForm(mode: Mode) {

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

    const [formState, setFormState] = useState<UserFormState>(emptyUserForm);

    const [submitWaiting, setSubmitWaiting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const [selectedUserUserId, setSelectedUserUserId] = useState<number | null>();
    const [userReady, setUserReady] = useState(false);

    const [confirmPasswordReady, setConfirmPasswordReady] = useState(false);
    const [passwordInvalidCondition, setPasswordInvalidCondition] = useState('');

    const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isPrintableAsciiOnly(value)) {
            const validity = validatePassword(value);
            if (!validity.isValid) {
                setStatusMsg(null);
                setError(validity.message);
            } else {
                setError(null);
                setStatusMsg('Confirm password');
            }
            
            setConfirmPasswordReady(validity.isValid);
        }
    };

    const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const asciiCode = e.key.charCodeAt(0);
        if (asciiCode < 33 || asciiCode > 126) {
            e.preventDefault();
        }
    };

    const resetAll = useCallback((exceptions?: string[]) => {
        !exceptions?.includes('error') && setError(null);
        !exceptions?.includes('status') && setStatusMsg(null);
        !exceptions?.includes('userReady') && setUserReady(false);
        !exceptions?.includes('form') && setFormState(emptyUserForm);
        !exceptions?.includes('userId') && setSelectedUserUserId(null);
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validity = validateEmail(formState.email);
        if (!validity.isValid) {
            setStatusMsg(null);
            setError(validity.message);
        } else if (validity.isValid) {
            setError(null);
            setStatusMsg(null);
        }
    }

    useEffect(() => { }, [confirmPasswordReady, passwordInvalidCondition])

    return {
        formState,
        setFormState,
        resetAll,
        error,
        statusMsg,
        submitWaiting,
        confirmPasswordReady,
        handlePasswordKeyDown,
        handlePasswordInput,
        handleSubmit
    }
}