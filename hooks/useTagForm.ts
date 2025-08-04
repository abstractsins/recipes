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

    const {
        refreshAllTags
    } = useDashboard();

    const [isAddFormValid, setAddFormValid] = useState(false);
    const [isEditFormValid, setEditFormValid] = useState(false);

    const [formState, setFormState] = useState<TagFormState>(emptyTagForm);

    const [selectedTagAuthor, setSelectedTagAuthor] = useState<UserOption | null>(null);
    const [selectedTagUser, setSelectedTagUser] = useState<UserOption | null>(null);

    const [submitWaiting, setSubmitWaiting] = useState(false);
    const [isUserInfoLoading, setUserInfoLoading] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [instructionMsg, setInstructionMsg] = useState<string | null>(null);

    const [selectedUserUserId, setSelectedUserUserId] = useState<number | null>(null);
    const [userReady, setUserReady] = useState(false);

    const [isTagInformationLoaded, setTagInformationLoaded] = useState<boolean>(false);

    const [isDisabled, setIsDisabled] = useState<boolean>(true);


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

    const handleTagTypeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({ ...prev, isIngredient: e.target.checked }));
    };

    const handleTagAvailabilitySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({ ...prev, isDefaultTag: e.target.checked }));
        setSelectedTagAuthor(null);
    };

    const handleTagAuthorSelect = (user: UserOption | null) => {
        setSelectedTagAuthor(user || null);
        setFormState({ ...formState, selectedTagAuthor: user?.value || null})
        console.log(user);
    };

    const handleTagUserSelect = (user: UserOption | null) => {
        setSelectedTagUser(user || null);
        setFormState({ ...formState, selectedTagUser: user?.value || null});

    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitWaiting(true);

        if (mode === 'add') {

            console.log(formState);

            const res = await fetch('/api/tag', {
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
                setSuccessMsg(`New ${formState.isDefaultTag ? 'default' : 'user'} tag created!`);
                refreshAllTags();
                setFormState(emptyTagForm);
                setSelectedTagAuthor(null);
            }

        } else if (mode === 'edit') {

        }

        setSubmitWaiting(false);
    }


    //*-------------------useEffects-------------------//

    useEffect(() => {
        if (formState.value && (formState.isDefaultTag || selectedTagAuthor?.value)) setAddFormValid(true);
        else setAddFormValid(false);
    }, [formState.value, formState.isDefaultTag, selectedTagAuthor?.value])

    useEffect(() => {
        if (isTagInformationLoaded) {
            setIsDisabled(false);
        }
    }, [isTagInformationLoaded ]);

    //*-------------------return-------------------//

    return {
        formState,
        setFormState,
        selectedTagAuthor,
        selectedTagUser,
        handleTagUserSelect,
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