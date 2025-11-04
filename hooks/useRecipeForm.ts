'use client';

//* --------------------------------------- //
//* -----------------IMPORTS--------------- //
//* --------------------------------------- //

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
    Tag,
    RecipeTag
} from "@/types/types";

import { useDashboard } from "@/context/DashboardContext";

import {
    createInputHandler,
    tagsIntoOptions
} from "@/utils/utils";

import { useSyncUserTags } from "@/hooks/useSyncUserTags";



//* --------------------------------------- //
//* -----------------EXPORTS--------------- //
//* --------------------------------------- //

export default function useRecipeForm(mode: 'add' | 'edit') {

    const {
        loadUserTags,
        fetchUserRecipes: contextFetchUserRecipes,
        fetchRecipeById: contextFetchRecipeInfo,
        refreshAllTags,
        refreshRecipeModule,
    } = useDashboard();

    const emptyRecipeForm: RecipeFormState = {
        name: '',
        translation: '',
        altName: '',
        selectedSeasons: [],
        selectedDefaultTagIds: [],
        selectedUserTagIds: []
    };


    //* -----------------STATES---------------- //

    //* SELECTION
    const [selectedRecipeUserId, setSelectedRecipeUserId] = useState<number | null>(null);
    const [selectedRecipeUserValue, setSelectedRecipeUserValue] = useState<UserOption | null>(null);

    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
    const [selectedRecipeValue, setSelectedRecipeValue] = useState('');

    const [isRecipeSelectReady, setIsRecipeSelectReady] = useState(false);
    const [userRecipeList, setUserRecipeList] = useState<Recipe[]>([]);
    const [recipeInfo, setRecipeInfo] = useState<Recipe | null>(null);

    const [userRecipeTagValue, setUserRecipeTagValue] = useState('');

    //* STATUSES
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [instructionMsg, setInstructionMsg] = useState<string | null>(null);

    //* FORM STATE
    const [formState, setFormState] = useState<RecipeFormState>(emptyRecipeForm);

    const [userTagsWaiting, setUserTagsWaiting] = useState(false);
    const [userRecipeTags, setUserRecipeTags] = useState<Tag[]>([]);

    //* READINESS / WAITING / LOADING / VALIDITY
    const [userReady, setUserReady] = useState(false);
    const [recipeReady, setRecipeReady] = useState(false);
    const [isIngredientModuleReady, setIsIngredientModuleReady] = useState(false);
    const [isRecipeLoading, setRecipeLoading] = useState(false);

    const [submitWaiting, setSubmitWaiting] = useState(false);

    const isDisabled = !recipeReady;


    //* -----------------VARIABLES--------------- //

    const userRecipeTagInputHandler = createInputHandler(setUserRecipeTagValue);


    //* ---------------FUNCTIONS--------------- //

    const clearStatuses = () => {
        console.warn(`'clearStatuses' has been called`);
        setError(null);
        setSuccessMsg(null);
        setWarningMsg(null);
        setInstructionMsg(null);
    }

    const handleRecipeSelect = (recipe: number | null) => {
        console.warn(`'handleRecipeSelect' has been called`);
        console.log('recipe id:', recipe);
        if (recipe !== null) {
            setSelectedRecipeId(recipe);
        } else {
            setSelectedRecipeId(null);
            setRecipeReady(false);
        }
    };

    const handleRecipeUserSelect = (user: UserOption | null) => {
        console.warn(`'handleRecipeUserSelect' has been called`);
        if (user !== null) {
            if (user.value !== null) {
                setSelectedRecipeUserId(user.value);
                setUserReady(true);
                setError(null);
                setSuccessMsg(null);
                setFormState(emptyRecipeForm);
            }
        } else {
            setSelectedRecipeUserId(null);
        }
        setSelectedRecipeUserValue(user);
    };

    //* -------------------- SUBMIT -------------------- //
    const handleRecipeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitWaiting(true);
        // mode === 'add' ? setIsAddFormValid(false) : setIsEditFormValid(false);

        clearStatuses();

        console.log(formState);

        const data = {
            ...formState,
            userId: mode === 'add' ? new FormData(e.currentTarget).get('user') : selectedRecipeUserId,
            RecipeTag: [...formState.selectedDefaultTagIds, ...formState.selectedUserTagIds]
        };

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
                console.warn(`setting SuccessMsg`);
                setSuccessMsg(mode === 'add' ? 'Recipe Created!' : 'Recipe Updated!');
                if (mode === 'edit') fetchUserRecipes({ quiet: true });
                refreshRecipeModule();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setRecipeInfo(null);
            setFormState(emptyRecipeForm);
            setSelectedRecipeUserId(selectedRecipeUserId);
            setSelectedRecipeValue('null');
            if (mode === 'edit') setRecipeReady(false);
            setSelectedRecipeId(null);
            setSubmitWaiting(false);
            document.getElementById('add-edit-recipe-module')?.scrollIntoView({ behavior: 'smooth' });
        }

    };

    const addUserRecipeTag = async () => {
        const uid = selectedRecipeUserId;
        setError(null);
        setSuccessMsg(null);
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
    };


    //* -----------------useCallback--------------- //

    const fetchUserRecipes = useCallback(
        async ({ quiet = false }: { quiet?: boolean } = {}) => {
            if (selectedRecipeUserId) {
                if (!quiet) setWarningMsg(`User ${mode === 'edit' ? 'recipes' : 'data'} loading...`);
                const data = await contextFetchUserRecipes(selectedRecipeUserId);
                setUserRecipeList(data);
                if (mode === 'add') {
                    setIsIngredientModuleReady(true);
                    setRecipeReady(true);
                } else {
                    setRecipeReady(false);
                    setIsRecipeSelectReady(true);
                }
            } else {
                setIsIngredientModuleReady(false);
                setRecipeReady(false);
                resetAll();
            }
            setWarningMsg(null);
        }, 
        [selectedRecipeUserId]
    );

    const fetchRecipeInfo = useCallback(
        async ({ quiet = false }: { quiet?: boolean } = {}) => {
            if (selectedRecipeId) {
                setRecipeLoading(true);
                if (!quiet) setWarningMsg(`Loading recipe info...`);
                const data = await contextFetchRecipeInfo(selectedRecipeId);
                setRecipeInfo(data);
                setRecipeReady(true);
                setIsIngredientModuleReady(true);
                setRecipeLoading(false);
                setWarningMsg(null);
                console.log(data);
            } else {
                setIsIngredientModuleReady(false);
                // resetAll(['userId', 'recipeList', 'recipeSelect']);
            }
        }, [selectedRecipeId]);

    const resetAll = useCallback((exceptions?: string[]) => {
        !exceptions?.includes('error') && setError(null);
        !exceptions?.includes('status') && setSuccessMsg(null);
        !exceptions?.includes('userId') && setSelectedRecipeUserId(null);
        !exceptions?.includes('userId') && setSelectedRecipeUserValue(null);
        !exceptions?.includes('recipeSelect') && setIsRecipeSelectReady(false);
        !exceptions?.includes('recipeList') && setUserRecipeList([]);
        !exceptions?.includes('recipeId') && setSelectedRecipeId(null);
        !exceptions?.includes('recipe') && setRecipeInfo(null);
        !exceptions?.includes('form') && setFormState(emptyRecipeForm);
        !exceptions?.includes('userReady') && setUserReady(false);
        !exceptions?.includes('recipeReady') && setRecipeReady(false);
    }, []);

    //* -----------------useMemo--------------- //

    const selectedUserRecipeTagOptions = useMemo(() => tagsIntoOptions(userRecipeTags), [userRecipeTags]);


    //* -----------------useEffect--------------- //

    useEffect(() => { fetchUserRecipes() }, [selectedRecipeUserId, fetchUserRecipes]);

    useEffect(() => { fetchRecipeInfo() }, [selectedRecipeId, fetchRecipeInfo]);

    useEffect(() => {
        if (recipeInfo) {

            const seasons: SeasonOption[] = recipeInfo.seasons.map(s => ({
                id: s.id,
                label: s.name,
                value: s.name.toLowerCase(),
                type: 'recipe'
            }));

            setFormState({
                name: recipeInfo.name ?? '',
                translation: recipeInfo.translation ?? '',
                altName: recipeInfo.altName ?? '',
                selectedSeasons: seasons.map((s: SeasonOption) => s.label) ?? [],
                selectedDefaultTagIds: recipeInfo.defaultTags?.map((t: RecipeTag) => t.tagId) ?? [],
                selectedUserTagIds: recipeInfo.userTags?.map((t: RecipeTag) => t.tagId) ?? []
            });
            if (mode === 'edit') setIsIngredientModuleReady(true);
        } else {
            setIsIngredientModuleReady(false);
        }
    }, [recipeInfo]);

    useEffect(() => {
        console.log('recipe ready:', recipeReady);
    }, [recipeReady]);


    //* -----------------CUSTOM HOOKS--------------- //

    useSyncUserTags<RecipeFormState>({
        type: 'recipe',
        uid: selectedRecipeUserId,
        loadUserTags,
        setFormState,
        tagResetKey: 'selectedUserTagIds',
        setUserTagsWaiting,
        setUserTags: setUserRecipeTags,
    });


    //* -----------------RETURN--------------- //

    return {
        formState, setFormState,
        resetAll,

        userRecipeList, recipeInfo,

        error, successMsg, warningMsg, instructionMsg,

        userRecipeTagValue,
        addUserRecipeTag,

        selectedRecipeId,
        selectedRecipeValue,
        selectedRecipeUserId,
        selectedRecipeUserValue,
        selectedUserRecipeTagOptions,

        handleRecipeSelect,
        handleRecipeUserSelect,
        userRecipeTagInputHandler,
        handleSubmit: handleRecipeSubmit,

        userReady, recipeReady,
        isRecipeSelectReady, isIngredientModuleReady,
        userTagsWaiting, submitWaiting, isRecipeLoading,
        isDisabled
    }
}