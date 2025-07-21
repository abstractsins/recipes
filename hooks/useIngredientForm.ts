'use client';



//*--------------------------------------------//
//*------------------IMPORT--------------------//
//*--------------------------------------------//

import {
    useState,
    useEffect,
    useCallback,
    useMemo
} from "react";

import {
    Ingredient,
    IngredientFormState,
    Tag,
    UserOption
} from "@/types/types";

import { useDashboard } from "@/context/DashboardContext";

import {
    createInputHandler,
    tagsIntoOptions
} from "@/utils/utils";

import { useSyncUserTags } from "@/hooks/useSyncUserTags";



//*--------------------------------------------//
//*------------------EXPORT--------------------//
//*--------------------------------------------//


export function useIngredientForm(mode: 'add' | 'edit') {



    //*----------------------------------------------//
    //*--------------------states--------------------//
    //*----------------------------------------------//

    const {
        fetchUserIngredients: contextFetchUserIngredients,
        fetchIngredientById,
        loadUserTags,
        refreshAllTags,
        refreshIngredientModule,
        setIngredientInfoLoading
    } = useDashboard();

    const emptyIngredientForm: IngredientFormState = {
        name: '',
        main: '',
        variety: '',
        category: '',
        subcategory: '',
        brand: '',
        selectedSeasonIndexes: [],
        selectedDefaultTagIndexes: [],
        selectedUserTagIndexes: []
    };

    const [formState, setFormState] = useState<IngredientFormState>(emptyIngredientForm);

    const [submitWaiting, setSubmitWaiting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [instructionMsg, setInstructionMsg] = useState<string | null>(null);

    const [userReady, setUserReady] = useState(false);
    const [ingredientReady, setIngredientReady] = useState(false);
    const [selectedIngredientUserId, setSelectedIngredientUserId] = useState<number | null>(null);
    const [selectedIngredientUserValue, setSelectedIngredientUserValue] = useState<UserOption | null>(null);
    const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null);

    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
    const [userIngredientList, setUserIngredientList] = useState<Ingredient[] | null>(null);
    const [ingredientInfo, setIngredientInfo] = useState<Ingredient | null>(null);

    const [userIngredientTagValue, setUserIngredientTagValue] = useState('');

    const [userIngredientListHasLoaded, setUserIngredientListHasLoaded] = useState<boolean>(false);

    const isDisabled = mode === 'edit' && !ingredientReady;



    //*-----------------------------------------------//
    //*-------------------functions-------------------//
    //*-----------------------------------------------//

    const clearStatuses = () => {
        setError(null);
        setSuccessMsg(null);
        setWarningMsg(null);
        setInstructionMsg(null);
    }

    const resetAll = useCallback((exceptions?: string[]) => {
        !exceptions?.includes('error') && setError(null);
        !exceptions?.includes('success') && setSuccessMsg(null);
        !exceptions?.includes('warning') && setWarningMsg(null);
        !exceptions?.includes('instruction') && setInstructionMsg(null);
        !exceptions?.includes('userId') && setSelectedIngredientUserId(null);
        !exceptions?.includes('userId') && setSelectedIngredientUserValue(null);
        !exceptions?.includes('ingredientList') && setUserIngredientList(null);
        !exceptions?.includes('ingredientId') && setSelectedIngredientId(null);
        !exceptions?.includes('ingredient') && setIngredientInfo(null);
        !exceptions?.includes('authorId') && setSelectedAuthorId(null);
        !exceptions?.includes('form') && setFormState(emptyIngredientForm);
        !exceptions?.includes('userReady') && setUserReady(false);
        !exceptions?.includes('ingredientReady') && setIngredientReady(false);
    }, []);

    const handleIngredientSelect = (id: number | null) => {
        if (!id) resetAll(['ingredientList', 'userReady', 'userId']);
        setSelectedIngredientId(id);
        setIngredientReady(!!id);
        clearStatuses();
    };

    const handleAuthorSelect = (user: UserOption | null) => {
        if (user !== null) {
            if (user.value !== null) {
                setSelectedAuthorId(user.value);
            }
        }
    };

    const handleIngredientUserSelect = (user: UserOption | null) => {
        if (user !== null) {
            if (user.value !== null) {
                setSelectedIngredientUserId(user.value);
                setUserReady(true);
            }
        } else {
            setIngredientReady(false);
            setUserReady(false);
            setSelectedIngredientId(null);
            setSelectedIngredientUserId(null)
        }
        clearStatuses();
        setSelectedIngredientUserValue(user);
        setFormState(emptyIngredientForm);
    }

    const fetchUserIngredients = useCallback(
        async ({ quiet = false }: { quiet?: boolean } = {}) => {
            if (selectedIngredientUserId) {
                if (!quiet) setWarningMsg('User ingredients loading...');
                const data = await contextFetchUserIngredients(selectedIngredientUserId);
                setUserIngredientList(data);
            }
            setWarningMsg(null);
        },
        [selectedIngredientUserId]
    );


    const fetchIngredientInfo = useCallback(
        async ({ quiet = false }: { quiet?: boolean } = {}) => {
            if (selectedIngredientId) {
                if (!quiet) setWarningMsg('Ingredient info loading...');
                const data = await fetchIngredientById(selectedIngredientId);
                setIngredientInfo(data);
            }
            setWarningMsg(null);
        }, [selectedIngredientId, fetchIngredientById]);

    // ➕👤🏷️
    const addUserIngredientTag = async () => {
        const uid = selectedAuthorId ?? selectedIngredientUserId;
        clearStatuses();
        if (userIngredientTagValue.trim() && uid) {
            const res = await fetch(`/api/tag/ingredient/user/${uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tagName: userIngredientTagValue.trim() }),
                credentials: 'include'
            });

            if (res.ok) {
                console.log('posted');
                const newTags = await loadUserTags('ingredient', uid);    // instant refresh
                setUserIngredientTags(newTags);
                refreshAllTags(); // module refresh
            } else {
                const err = await res.json();
                setError(err.message);
                document.getElementById('add-edit-ingredient-module')?.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setUserIngredientTagValue('');
        const input = document.querySelector('input[name="add-user-ingredient-tag"]') as HTMLInputElement | null;
        if (input) input.focus();
    };

    const userIngredientTagInputHandler = createInputHandler(setUserIngredientTagValue);

    const handleIngredientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitWaiting(true);
        clearStatuses();

        const data = {
            ...formState,
            userId: mode === 'add'
                ? new FormData(e.currentTarget).get('user')
                : selectedIngredientUserId, 
                    IngredientTag: [...formState.selectedDefaultTagIndexes, ...formState.selectedUserTagIndexes]
        };

        try {
            const res = await fetch(
                mode === 'add' ? '/api/ingredient' : `/api/ingredient/${selectedIngredientId}`, {
                method: mode === 'add' ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!res.ok) {
                const error = await res.json();
                console.log(error);
                console.error(error.message);
                setError(error.message);
            } else {
                const json = await res.json();
                setSuccessMsg(mode === 'add' ? 'Ingredient Created!' : 'Ingredient Updated!');
                if (mode === 'edit') fetchUserIngredients({ quiet: true });
                refreshIngredientModule();
            }
        } catch (err) {
            console.error(err);
            setError('Error: see console');
        } finally {
            setIngredientInfo(null);
            setFormState(emptyIngredientForm);
            setIngredientReady(false);
            setSelectedIngredientId(null);
            setSubmitWaiting(false);

            document.getElementById('add-edit-ingredient-module')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [userTagsWaiting, setUserTagsWaiting] = useState(false);
    const [userIngredientTags, setUserIngredientTags] = useState<Tag[]>([]);
    const selectedUserIngredientTagOptions = useMemo(() => tagsIntoOptions(userIngredientTags), [userIngredientTags]);


    useSyncUserTags<IngredientFormState>({
        type: 'ingredient',
        uid: selectedAuthorId ?? selectedIngredientUserId,
        loadUserTags,
        setFormState,
        tagResetKey: 'selectedUserTagIndexes',
        setUserTagsWaiting,
        setUserTags: setUserIngredientTags,
    });



    //*------------------------------------------------//
    //*-------------------useEffects-------------------//
    //*------------------------------------------------//

    useEffect(() => { fetchUserIngredients(); }, [selectedIngredientUserId, fetchUserIngredients]);
    useEffect(() => { fetchIngredientInfo(); }, [selectedIngredientId, fetchIngredientInfo]);
    useEffect(() => {
        if (ingredientInfo) {
            console.log(ingredientInfo.defaultTags);
            console.log(ingredientInfo.userTags);
            setFormState({
                name: ingredientInfo.name ?? '',
                main: ingredientInfo.main ?? '',
                variety: ingredientInfo.variety ?? '',
                category: ingredientInfo.category ?? '',
                subcategory: ingredientInfo.subcategory ?? '',
                brand: ingredientInfo.brand ?? '',
                selectedSeasonIndexes: ingredientInfo.seasons.map(s => s.id) ?? [],
                selectedDefaultTagIndexes: ingredientInfo.defaultTags.map((t: Tag) => t.id) ?? [],
                selectedUserTagIndexes: ingredientInfo.userTags.map((t: Tag) => t.id) ?? []
            });
        }
    }, [ingredientInfo]);

    useEffect(() => {
        if (selectedIngredientUserId && userIngredientList) {
            console.log(userIngredientList);
            setUserIngredientListHasLoaded(true);
        } else {
            console.warn('no list');
            setUserIngredientList(null);
            setUserIngredientListHasLoaded(false);
        }
    }, [selectedIngredientUserId]);



    //*--------------------------------------------//
    //*-------------------return-------------------//
    //*--------------------------------------------//

    return {
        formState, setFormState,
        handleIngredientSelect,
        handleIngredientUserSelect,
        selectedUserIngredientTagOptions,
        handleAuthorSelect,
        userIngredientTagValue,
        userIngredientTagInputHandler,
        addUserIngredientTag,
        handleSubmit: handleIngredientSubmit,
        selectedIngredientUserId,
        selectedIngredientUserValue,
        selectedIngredientId,
        userIngredientList,
        userTagsWaiting,
        error, successMsg, warningMsg, instructionMsg,
        isDisabled,
        userReady,
        resetAll,
        selectedAuthorId,
        submitWaiting,
        userIngredientListHasLoaded,
        ingredientInfo
    };
}
