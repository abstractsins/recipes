'use client';

import {
    useState,
    useEffect,
    useCallback,
    useMemo
} from "react";

import {
    Ingredient,
    IngredientFormState,
    TagOption,
    SeasonOption,
    Tag
} from "@/types/types";

import { useDashboard } from "@/context/DashboardContext";

import {
    handleIngredientUserSelectFactory,
    createInputHandler,
    tagsIntoOptions
} from "@/utils/utils";

import { useSyncUserTags } from "@/hooks/useSyncUserTags";



export function useIngredientForm(mode: 'add' | 'edit') {

    const {
        fetchUserIngredients: contextFetchUserIngredients,
        fetchIngredientById,
        allUserIngredientTags,
        loadUserTags,
        refreshAllTags,
        refreshIngredientModule
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
    const [ingredientLoading, setIngredientLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const [userReady, setUserReady] = useState(false);
    const [ingredientReady, setIngredientReady] = useState(false);
    const [selectedIngredientUserId, setSelectedIngredientUserId] = useState<number | null>(null);
    const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null);
    const [ingredientValue, setIngredientValue] = useState('');

    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
    const [userIngredientList, setUserIngredientList] = useState<Ingredient[]>([]);
    const [ingredientInfo, setIngredientInfo] = useState<Ingredient | null>(null);

    const [userIngredientTagValue, setUserIngredientTagValue] = useState('');

    const isDisabled = mode === 'edit' && !ingredientReady;


    const resetAll = useCallback((exceptions?: string[]) => {
        !exceptions?.includes('error') && setError(null);
        !exceptions?.includes('status') && setStatusMsg(null);
        !exceptions?.includes('userId') && setSelectedIngredientUserId(null);
        !exceptions?.includes('ingredientList') && setUserIngredientList([]);
        !exceptions?.includes('ingredientId') && setSelectedIngredientId(null);
        !exceptions?.includes('ingredient') && setIngredientInfo(null);
        !exceptions?.includes('authorId') && setSelectedAuthorId(null);
        !exceptions?.includes('form') && setFormState(emptyIngredientForm);
        !exceptions?.includes('userReady') && setUserReady(false);
        !exceptions?.includes('ingredientReady') && setIngredientReady(false);
    }, []);


    const handleIngredientSelect = (id: number | null) => {
        setSelectedIngredientId(id);
        setIngredientReady(!!id);
        if (!id) resetAll(['ingredientList', 'userReady', 'userId']);
        setError(null);
        setStatusMsg(null);
    };

    const handleAuthorSelect = (id: number | null) => {
        setSelectedAuthorId(id);
    };

    const handleIngredientUserSelect = handleIngredientUserSelectFactory(
        setSelectedIngredientUserId,
        setUserReady,
        setIngredientReady,
        setSelectedIngredientId,
        setFormState,
        resetAll,
        setStatusMsg,
        emptyIngredientForm
    );

    const fetchUserIngredients = useCallback(async () => {
        if (selectedIngredientUserId) {
            const data = await contextFetchUserIngredients(selectedIngredientUserId);
            setUserIngredientList(data);
        }
    }, [selectedIngredientUserId, contextFetchUserIngredients]);

    const fetchIngredientInfo = useCallback(async () => {
        if (selectedIngredientId) {
            setIngredientLoading(true);
            const data = await fetchIngredientById(selectedIngredientId);
            setIngredientInfo(data);
            setIngredientLoading(false);
        }
    }, [selectedIngredientId, fetchIngredientById]);

    // ➕👤🏷️
    const addUserIngredientTag = async () => {
        const uid = selectedAuthorId ?? selectedIngredientUserId;
        setError(null);
        setStatusMsg(null);
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
        setError(null);
        setStatusMsg(null);

        const data = {
            ...formState,
            userId: mode === 'add' ? new FormData(e.currentTarget).get('user') : selectedIngredientUserId,
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
                setError(error.message);
            } else {
                const json = await res.json();
                setStatusMsg(mode === 'add' ? 'Ingredient Created!' : 'Ingredient Updated!');
                if (mode === 'edit') fetchUserIngredients();
                refreshIngredientModule();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitWaiting(false);
            resetAll(['userReady', 'status', 'ingredientList', 'error', 'authorId']);
            setSelectedIngredientUserId(selectedIngredientUserId);
            setSelectedIngredientId(null);
            setIngredientValue('null');
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

                selectedDefaultTagIndexes: ingredientInfo.defaultTags.map(t => t.tagId) ?? [],
                selectedUserTagIndexes: ingredientInfo.userTags.map(t => t.tagId) ?? []
            });
        }
    }, [ingredientInfo]);



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
        selectedIngredientId,
        userIngredientList,
        userTagsWaiting,
        error,
        statusMsg,
        isDisabled,
        submitWaiting,
        selectedAuthorId,
        resetAll
    };
}
