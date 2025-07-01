'use client';

import { useState, useEffect, useCallback } from "react";
import {
    Ingredient,
    IngredientFormState,
    TagOption,
    SeasonOption
} from "@/types/types";

import { useDashboard } from "@/context/DashboardContext";



export function useIngredientForm(mode: 'add' | 'edit') {

    const {
        fetchUserIngredients: contextFetchUserIngredients,
        fetchIngredientById,
        allUserIngredientTags,
        loadUserTags,
        refreshAllTags,
        refreshIngredientModule
    } = useDashboard();

    console.warn(allUserIngredientTags);

    const [submitWaiting, setSubmitWaiting] = useState(false);
    const [ingredientLoading, setIngredientLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const [userReady, setUserReady] = useState(false);
    const [ingredientReady, setIngredientReady] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null);
    const [ingredientValue, setIngredientValue] = useState('');

    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
    const [userIngredientList, setUserIngredientList] = useState<Ingredient[]>([]);
    const [ingredientInfo, setIngredientInfo] = useState<Ingredient | null>(null);

    const [userIngredientTagValue, setUserIngredientTagValue] = useState('');

    const [formState, setFormState] = useState<IngredientFormState>({
        name: '',
        main: '',
        variety: '',
        category: '',
        subcategory: '',
        selectedSeasonIndexes: [],
        selectedDefaultTagIndexes: [],
        selectedUserTagIndexes: []
    });

    const isDisabled = mode === 'edit' && !ingredientReady;

    const resetAll = useCallback((exceptions?: string[]) => {
        !exceptions?.includes('error') && setError(null);
        !exceptions?.includes('status') && setStatusMsg(null);
        !exceptions?.includes('userId') && setSelectedUserId(null);
        !exceptions?.includes('ingredientList') && setUserIngredientList([]);
        !exceptions?.includes('ingredientId') && setSelectedIngredientId(null);
        !exceptions?.includes('ingredient') && setIngredientInfo(null);
        !exceptions?.includes('authorId') && setSelectedAuthorId(null);
        !exceptions?.includes('form') && setFormState({
            name: '',
            main: '',
            variety: '',
            category: '',
            subcategory: '',
            selectedSeasonIndexes: [],
            selectedDefaultTagIndexes: [],
            selectedUserTagIndexes: []
        });
        !exceptions?.includes('userReady') && setUserReady(false);
        !exceptions?.includes('ingredientReady') && setIngredientReady(false);
    }, []);

    // 🍁
    const handleSeasonSelect = (season: SeasonOption, checked: boolean) => {
        console.log(season, checked);
        console.log(formState.selectedSeasonIndexes);

        setFormState(prev => ({
            ...prev,
            selectedSeasonIndexes: checked
                ? [...prev.selectedSeasonIndexes, season.id]
                : prev.selectedSeasonIndexes.filter(s => s !== season.id),
        }));
    };

    const handleDefaultTagSelect = (tag: TagOption, checked: boolean) => {
        console.log(formState.selectedDefaultTagIndexes);
        setFormState(prev => ({
            ...prev,
            selectedDefaultTagIndexes: checked
                ? [...prev.selectedDefaultTagIndexes, tag.id]
                : prev.selectedDefaultTagIndexes.filter(id => id !== tag.id)

        }));

    };

    const handleUserTagSelect = (tag: TagOption, checked: boolean) => {
        console.log(tag);
        setFormState(prev => ({
            ...prev,
            selectedUserTagIndexes: checked
                ? [...prev.selectedUserTagIndexes, tag.id]
                : prev.selectedUserTagIndexes.filter(id => id !== tag.id)
        }));
    };

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

    const handleUserSelect = async (id: number | null) => {
        if (id !== null) {
            setSelectedUserId(id);
            setUserReady(true);
            setIngredientReady(false);
            setSelectedIngredientId(null);
            setFormState({
                name: '',
                main: '',
                variety: '',
                category: '',
                subcategory: '',
                selectedSeasonIndexes: [],
                selectedDefaultTagIndexes: [],
                selectedUserTagIndexes: []
            });
        } else {
            setUserReady(false);
            resetAll();
        }
        setStatusMsg(null);
    };

    const fetchUserIngredients = useCallback(async () => {
        if (selectedUserId) {
            const data = await contextFetchUserIngredients(selectedUserId);
            setUserIngredientList(data);
        }
    }, [selectedUserId, contextFetchUserIngredients]);

    const fetchIngredientInfo = useCallback(async () => {
        if (selectedIngredientId) {
            setIngredientLoading(true);
            const data = await fetchIngredientById(selectedIngredientId);
            setIngredientInfo(data);
            setIngredientLoading(false);
        }
    }, [selectedIngredientId, fetchIngredientById]);

    const addUserIngredientTag = async () => {
        const uid = selectedAuthorId ?? selectedUserId;
        if (userIngredientTagValue.trim() && uid) {
            const res = await fetch(`/api/tag/ingredient/user/${uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tagName: userIngredientTagValue.trim() }),
                credentials: 'include'
            });

            if (res.ok) {
                console.log('posted');
                loadUserTags('ingredient', uid, { silent: true });   // instant refresh
                refreshAllTags(); // module refresh
            }
        }
        setUserIngredientTagValue('');
        const input = document.querySelector('input[name="add-user-ingredient-tag"]') as HTMLInputElement | null;
        if (input) input.focus();
    };

    const userIngredientTagInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserIngredientTagValue(e.currentTarget.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitWaiting(true);
        setError(null);
        setStatusMsg(null);

        console.log(formState)

        const data = {
            ...formState,
            userId: mode === 'add' ? new FormData(e.currentTarget).get('user') : selectedUserId,
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
                setError(error.error);
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
            setSelectedUserId(selectedUserId);
            setSelectedIngredientId(null);
            setIngredientValue('null');
            document.getElementById('add-edit-ingredient-module')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => { fetchUserIngredients(); }, [selectedUserId, fetchUserIngredients]);
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
                selectedSeasonIndexes: ingredientInfo.seasons.map(s => s.id) ?? [],

                selectedDefaultTagIndexes: ingredientInfo.defaultTags.map(t => t.tagId) ?? [],
                selectedUserTagIndexes: ingredientInfo.userTags.map(t => t.tagId) ?? []
            });
        }
    }, [ingredientInfo]);



    useEffect(() => {
        if (selectedAuthorId || selectedUserId) {
            setFormState(prev => ({
                ...prev,
                selectedUserTagIndexes: []
            }));
        }
    }, [selectedAuthorId, selectedUserId]);



    useEffect(() => {
        if (selectedAuthorId) {
            // get the users tags
            loadUserTags('ingredient', selectedAuthorId);
        }
    }, [selectedAuthorId]);



    useEffect(() => {
        if (selectedUserId) {
            // get the users tags
            loadUserTags('ingredient', selectedUserId);
        }
    }, [selectedUserId]);



    return {
        formState, setFormState,
        handleSeasonSelect,
        handleDefaultTagSelect,
        handleUserTagSelect,
        handleIngredientSelect,
        handleUserSelect,
        handleAuthorSelect,
        userIngredientTagValue,
        userIngredientTagInputHandler,
        addUserIngredientTag,
        handleSubmit,
        selectedUserId,
        selectedIngredientId,
        userIngredientList,
        error,
        statusMsg,
        isDisabled,
        submitWaiting,
        selectedAuthorId,
        resetAll
    };
}
