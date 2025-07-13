'use client';

import {
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";

import {
    Recipe,
    RecipeFormState,
    SeasonOption,
    UserOption,
    TagOption,
    Tag
} from "@/types/types";

import { useDashboard } from "@/context/DashboardContext";

import {
    createInputHandler,
    tagsIntoOptions
} from "@/utils/utils";

import { useSyncUserTags } from "@/hooks/useSyncUserTags";



export default function useRecipeForm(mode: 'add' | 'edit') {

    const {
        loadUserTags,
        fetchUserRecipes: contextFetchUserRecipes,
        refreshAllTags,
        refreshRecipeModule
    } = useDashboard();

    const emptyRecipeForm: RecipeFormState = {
        name: '',
        selectedSeasonIndexes: [],
        selectedDefaultTagIndexes: [],
        selectedUserTagIndexes: []
    };

    const [submitWaiting, setSubmitWaiting] = useState(false);

    const [userReady, setUserReady] = useState(false);
    const [recipeReady, setRecipeReady] = useState(false);

    const [selectedRecipeUserId, setSelectedRecipeUserId] = useState<number | null>(null);
    const [selectedRecipeUserValue, setSelectedRecipeUserValue] = useState<UserOption | null>(null);

    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
    const [recipeValue, setRecipeValue] = useState('');

    const [userRecipeList, setUserRecipeList] = useState<Recipe[]>([]);
    const [recipeInfo, setRecipeInfo] = useState<Recipe | null>(null);

    const [userRecipeTagValue, setUserRecipeTagValue] = useState('');

    const isDisabled = !recipeReady;

    const [error, setError] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [instructionMsg, setInstructionMsg] = useState<string | null>(null);


    const resetAll = useCallback((exceptions?: string[]) => {
        !exceptions?.includes('error') && setError(null);
        !exceptions?.includes('status') && setStatusMsg(null);
        !exceptions?.includes('userId') && setSelectedRecipeUserId(null);
        !exceptions?.includes('userId') && setSelectedRecipeUserValue(null);
        !exceptions?.includes('recipeList') && setUserRecipeList([]);
        !exceptions?.includes('recipeId') && setSelectedRecipeId(null);
        !exceptions?.includes('recipe') && setRecipeInfo(null);
        !exceptions?.includes('form') && setFormState(emptyRecipeForm);
        !exceptions?.includes('userReady') && setUserReady(false);
        !exceptions?.includes('recipeReady') && setRecipeReady(false);
    }, []);

    const [formState, setFormState] = useState<RecipeFormState>(emptyRecipeForm);

    const handleRecipeSelect = () => { };

    const userRecipeTagInputHandler = createInputHandler(setUserRecipeTagValue);

    const handleRecipeUserSelect = (user: UserOption | null) => {
        if (user !== null) {
            if (user.value !== null) {
                setSelectedRecipeUserId(user.value);
                setUserReady(true);
                setError(null);
                setStatusMsg(null);
                setRecipeReady(true);
                setFormState(emptyRecipeForm);
            }
        } else {
            setRecipeReady(false);
            setSelectedRecipeUserId(null);

        }
        setSelectedRecipeUserValue(user);
    }

    const fetchUserRecipes = useCallback(async () => {
        if (selectedRecipeUserId) {
            console.log(selectedRecipeUserId);
            const data = await contextFetchUserRecipes(selectedRecipeUserId);
            setUserRecipeList(data);
        }
    }, [selectedRecipeUserId, contextFetchUserRecipes]);

    const fetchRecipeInfo = useCallback(async () => { }, []);

    const addUserRecipeTag = async () => {
        const uid = selectedRecipeUserId;
        setError(null);
        setStatusMsg(null);
        if (userRecipeTagValue.trim() && uid) {
            const res = await fetch(`/api/tag/recipe/user/${uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tagName: userRecipeTagValue.trim() }),
                credentials: 'include'
            });

            if (res.ok) {
                console.log('posted');
                const newTags = await loadUserTags('recipe', uid);    // instant refresh
                setUserRecipeTags(newTags);
                refreshAllTags();   // module refresh
            } else {
                const err = await res.json();
                setError(err.message);
                document.getElementById('add-edit-recipe-module')?.scrollIntoView({ behavior: 'smooth' });
            }

        }
        setUserRecipeTagValue('');
        const input = document.querySelector('input[name="add-user-recipe-tag"]') as HTMLInputElement | null;
        if (input) input.focus();
    }

    const [userTagsWaiting, setUserTagsWaiting] = useState(false);
    const [userRecipeTags, setUserRecipeTags] = useState<Tag[]>([]);
    const selectedUserRecipeTagOptions = useMemo(() => tagsIntoOptions(userRecipeTags), [userRecipeTags]);

    const handleRecipeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitWaiting(true);
        setError(null);
        setStatusMsg(null);

        console.log(formState);

        const data = {
            ...formState,
            userId: mode === 'add' ? new FormData(e.currentTarget).get('user') : selectedRecipeUserId,
            RecipeTag: [...formState.selectedDefaultTagIndexes, ...formState.selectedUserTagIndexes]
        }

        try {
            const res = await fetch(
                mode === 'add' ? '/api/recipe' : `/api/recipe/${selectedRecipeId}`, {
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
                setStatusMsg(mode === 'add' ? 'Recipe Created!' : 'Recipe Updated!');
                if (mode === 'edit') fetchUserRecipes();
                refreshRecipeModule();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitWaiting(false);
            resetAll(['userReady', 'status', 'recipeList', 'error', 'authorId']);
            setSelectedRecipeUserId(selectedRecipeUserId);
            setSelectedRecipeId(null);
            setRecipeValue('null');
            document.getElementById('add-edit-recipe-module')?.scrollIntoView({ behavior: 'smooth' });
        }

    };

    useSyncUserTags<RecipeFormState>({
        type: 'recipe',
        uid: selectedRecipeUserId,
        loadUserTags,
        setFormState,
        tagResetKey: 'selectedUserTagIndexes',
        setUserTagsWaiting,
        setUserTags: setUserRecipeTags,
    });

    useEffect(() => { fetchUserRecipes(); }, [selectedRecipeUserId, fetchUserRecipes]);
    useEffect(() => { fetchRecipeInfo(); }, [selectedRecipeId, fetchRecipeInfo]);
    useEffect(() => {
        if (recipeInfo) {
            console.log(recipeInfo.defaultTags);
            console.log(recipeInfo.userTags);
            setFormState({
                name: recipeInfo.name ?? '',
                selectedSeasonIndexes: recipeInfo.seasons.map(s => s.id) ?? [],
                selectedDefaultTagIndexes: recipeInfo.defaultTags.map(t => t.tagId) ?? [],
                selectedUserTagIndexes: recipeInfo.userTags.map(t => t.tagId) ?? []
            });
        }
    }, [recipeInfo]);


    return {
        formState,
        setFormState,
        resetAll,
        isDisabled,
        selectedUserRecipeTagOptions,
        userTagsWaiting,
        userRecipeList,
        handleSubmit: handleRecipeSubmit,
        submitWaiting,
        selectedRecipeId,
        userRecipeTagValue,
        addUserRecipeTag,
        selectedRecipeUserId,
        selectedRecipeUserValue,
        handleRecipeSelect,
        handleRecipeUserSelect,
        userRecipeTagInputHandler,
    }
}