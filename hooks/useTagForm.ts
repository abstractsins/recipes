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
    Mode,
    TagFormState,
    User,
    UserOption
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

export default function useTagForm(mode: Mode) {

    const emptyTagForm: TagFormState = {
        value: '',
        isIngredient: false,
        isDefaultTag: false,
        selectedTagAuthor: null,
        selectedTagUser: null
    };

    const [isAddFormValid, setAddFormValid] = useState(false);
    const [isEditFormValid, setEditFormValid] = useState(false);

    const [formState, setFormState] = useState<TagFormState>(emptyTagForm);

    const [selectedTagAuthor, setSelectedTagAuthor] = useState<UserOption | null>(null);

    const [submitWaiting, setSubmitWaiting] = useState(false);
    const [isUserInfoLoading, setUserInfoLoading] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [instructionMsg, setInstructionMsg] = useState<string | null>(null);

    const [selectedUserUserId, setSelectedUserUserId] = useState<number | null>(null);
    const [userReady, setUserReady] = useState(false);

    const [isDisabled, setIsDisabled] = useState<boolean>();


    //*-------------------functions-------------------//

    const clearStatuses = () => {
        setError(null);
        setSuccessMsg(null);
        setWarningMsg(null);
        setInstructionMsg(null);
    };

    const resetAll = useCallback((exceptions?: string[]) => {
        !exceptions?.includes('error') && setError(null);
        !exceptions?.includes('success') && setSuccessMsg(null);
        !exceptions?.includes('warning') && setWarningMsg(null);
        !exceptions?.includes('instruction') && setInstructionMsg(null);
        !exceptions?.includes('userReady') && setUserReady(false);
        !exceptions?.includes('form') && setFormState(emptyTagForm);
        !exceptions?.includes('userId') && setSelectedUserUserId(null);
    }, []);

    const handleTagTypeSelect = () => { };

    const handleTagAuthorSelect = (user: UserOption | null) => {
        console.log(user);
        setSelectedTagAuthor(user || null);
    };

    const handleTagAvailabilitySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.checked);
        setFormState(prev => ({ ...prev, isDefaultTag: e.target.checked }));
        setSelectedTagAuthor(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitWaiting(true);
        setSubmitWaiting(false);
    }


    //*-------------------useEffects-------------------//

    useEffect(() => {
        console.log(formState.value);
        console.log(formState.isDefaultTag);
        console.log(selectedTagAuthor);
        if (formState.value && (formState.isDefaultTag || selectedTagAuthor?.value)) {
            setAddFormValid(true);
        } else {
            setAddFormValid(false);
        }
    }, [formState.value, formState.isDefaultTag, selectedTagAuthor?.value])


    //*-------------------return-------------------//

    return {
        formState,
        setFormState,
        selectedTagAuthor,
        handleTagTypeSelect,
        handleTagAuthorSelect,
        handleTagAvailabilitySelect,
        resetAll,
        error, successMsg, submitWaiting, warningMsg, instructionMsg,
        handleSubmit,
        isDisabled,
        isAddFormValid, isEditFormValid,
        isUserInfoLoading
    }
}