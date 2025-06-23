'use client';

import styles from './AddEditIngredient.module.css';

import { FiPlusCircle } from "react-icons/fi";

import {
    useEffect,
    useState,
    useCallback
} from "react";

import {
    AdminModule,
    Ingredient,
    Mode,
    IngredientFormState,
    TagOption,
    SeasonOption
} from "@/types/types";

import Loader from "@/components/general/Loader";
import ScreenGuard from "@/components/general/ScreenGuard";

import FormRow from "@/components/admin/formElements/FormRow";
import FieldModule from "@/components/admin/formElements/FieldModule";
import CloseButton from "@/components/admin/dashboard/CloseButton";

import AdminInput from "../formElements/AdminInput";
import AdminSelect from "../formElements/AdminSelect";
import TagsSelect from "../TagsSelect";
import UserSelect from "../formElements/UserSelect";
import IngredientSelect from "../formElements/IngredientSelect";
import AddEditIngredientHeader from "./AddEditIngredientHeader";

import { seasonOptions, seasonsIntoOptions, tagsIntoOptions } from "@/utils/utils";

import { toTitleCase } from "@/utils/utils";
import IngredientTags from "../IngredientTags";


export default function AddEditIngredient({ className, onClick: activate, active, close }: AdminModule) {

    //* STATES
    const [waiting, setWaiting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const [mode, setMode] = useState<Mode>('add');

    const [userReady, setUserReady] = useState(false);
    const [ingredientReady, setIngredientReady] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null);
    const [ingredientValue, setIngredientValue] = useState('');

    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);

    const [userIngredientList, setUserIngredientList] = useState<Ingredient[]>([]);
    const [ingredientInfo, setIngredientInfo] = useState<Ingredient | null>(null);

    const [userIngredientTagValue, setUserIngredientTagValue] = useState('');
    const [userTagsRefreshKey, setUserTagsRefreshKey] = useState(0);

    const [formState, setFormState] = useState<IngredientFormState>({
        name: '',
        main: '',
        variety: '',
        category: '',
        subcategory: '',
        seasons: [],
        selectedDefaultTagIndexes: [],
        selectedUserTagIndexes: []
    });

    const isDisabled = mode === 'edit' && !ingredientReady;


    //* FUNCTIONS

    const triggerUserTagRefresh = () => setUserTagsRefreshKey(prev => prev + 1);

    // Reset everything
    const resetAll = (exceptions?: string[]) => {
        !exceptions?.includes('error') && setError(null);
        !exceptions?.includes('status') && setStatusMsg(null);
        !exceptions?.includes('userId') && setSelectedUserId(null);
        !exceptions?.includes('ingredientList') && setUserIngredientList([]);
        !exceptions?.includes('ingredientId') && setSelectedIngredientId(null);
        !exceptions?.includes('ingredient') && setIngredientInfo(null);
        !exceptions?.includes('authorId') && setSelectedAuthorId(null);
        !exceptions?.includes('form') && setFormState({ name: '', main: '', variety: '', category: '', subcategory: '', seasons: [], selectedDefaultTagIndexes: [], selectedUserTagIndexes: [] });
        !exceptions?.includes('userReady') && setUserReady(false);
        !exceptions?.includes('ingredientReady') && setIngredientReady(false);
    };

    // Handle Season changes
    const handleSeasonSelect = (season: SeasonOption, checked: boolean) => {
        setFormState(prev => ({
            ...prev,
            seasons: checked ? [...prev.seasons, season.value] : prev.seasons.filter(s => s !== season.value),
        }));
    };

    // Default Tags
    const handleDefaultTagSelect = (tag: TagOption, checked: boolean) => {
        console.log(formState.selectedDefaultTagIndexes)
        setFormState(prev => ({
            ...prev,
            selectedDefaultTagIndexes: checked ? [...prev.selectedDefaultTagIndexes, tag.id] : prev.selectedDefaultTagIndexes.filter(s => s !== tag.id),
        }));
    };

    const handleUserTagSelect = (tag: TagOption, checked: boolean) => {
        setFormState(prev => ({
            ...prev,
            selectedUserTagIndexes: checked ? [...prev.selectedUserTagIndexes, tag.id] : prev.selectedUserTagIndexes.filter(s => s !== tag.id),
        }));
    };

    const handleIngredientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ingredientId = Number(e.target.value.split(" ")[0].match(/\d+/));
        if (!isNaN(ingredientId)) {
            setSelectedIngredientId(ingredientId);
            setIngredientReady(true);
        } else {
            setIngredientReady(false);
        }
        setStatusMsg(null);
        setError(null);
    };

    const handleModeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMode(e.target.checked ? 'edit' : 'add');
        resetAll();
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWaiting(true);
        setError(null);
        setStatusMsg(null);

        const data = {
            ...formState,
            userId: mode === 'add' ? (new FormData(e.currentTarget).get('user')) : selectedUserId,
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
                console.log(error.error);
                setError(error.error);
            } else {
                const json = await res.json(); ``
                console.log(json);
                setStatusMsg(mode === 'add' ? 'Ingredient Created!' : 'Ingredient Updated!');
                if (mode === 'edit') {
                    fetchUserIngredients();
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setWaiting(false);
            resetAll(['userReady', 'status', 'ingredientList', 'error']);
            setSelectedUserId(selectedUserId);
            setSelectedIngredientId(null);
            setIngredientValue('null');
        }

        document.getElementById('add-edit-ingredient-module')?.scrollIntoView({ behavior: 'smooth' })
    };

    const userIngredientTagInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);
        const inputValue = e.currentTarget.value;
        console.log(inputValue);
        setUserIngredientTagValue(inputValue);
    }

    const userIngredientTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log(e.nativeEvent.key);
        if (e.nativeEvent.key === 'Enter') {
            addUserIngredientTag();
        }
    }

    const handleAuthorSelect = (author: string) => {
        const id: number = Number(author.split(':')[0]);
        if (isNaN(id)) setSelectedAuthorId(null);
        else setSelectedAuthorId(id);

        triggerUserTagRefresh();
    };


    // User selection (edit mode)
    const handleUserSelect = async (selectedUser: string) => {
        const userId = Number(selectedUser.split(":")[0]);
        if (!isNaN(userId)) {
            setSelectedUserId(userId);
            setUserReady(true);
            setIngredientReady(false);
            setFormState({
                name: '',
                main: '',
                variety: '',
                category: '',
                subcategory: '',
                seasons: [],
                selectedDefaultTagIndexes: [],
                selectedUserTagIndexes: []
            });
        } else {
            setUserReady(false);
            resetAll();
        }
        setStatusMsg(null);
        triggerUserTagRefresh();
    };


    // Fetch ingredient list for user
    const fetchUserIngredients = useCallback(async () => {
        if (selectedUserId) {
            const res = await fetch(`/api/ingredient/user/${selectedUserId}`);
            const data = await res.json();
            setUserIngredientList(data);
        }
    }, [selectedUserId]);

    // Fetch individual ingredient
    const fetchIngredientInfo = useCallback(async () => {
        if (selectedIngredientId) {
            const res = await fetch(`/api/ingredient/${selectedIngredientId}`);
            const data: Ingredient = await res.json();
            setIngredientInfo(data);
        }
    }, [selectedIngredientId]);

    const addUserIngredientTag = async () => {
        const newTag = await fetch(`/api/tag/ingredient/user/${selectedAuthorId ?? selectedUserId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tagName: userIngredientTagValue }),
            credentials: 'include'
        });

        setUserIngredientTagValue('');
        triggerUserTagRefresh();
        const input: HTMLInputElement | null = document.querySelector(' input[name="add-user-ingredient-tag"]');
        if (input) input.focus();
    }


    // * EFFECTS
    // Populate formState when ingredientInfo changes
    useEffect(() => {
        if (ingredientInfo) {
            setFormState({
                name: ingredientInfo.name ?? '',
                main: ingredientInfo.main ?? '',
                variety: ingredientInfo.variety ?? '',
                category: ingredientInfo.category ?? '',
                subcategory: ingredientInfo.subcategory ?? '',
                seasons: seasonsIntoOptions(ingredientInfo.seasons) ?? [],
                // selectedDefaultTagOptions: tagsIntoOptions(ingredientInfo.defaultTags) ?? [],
                // selectedUserTagOptions: tagsIntoOptions(ingredientInfo.userTags) ?? []
                selectedDefaultTagIndexes: ingredientInfo.defaultTags ?? [],
                selectedUserTagIndexes: ingredientInfo.userTags ?? []
            });
        }
    }, [ingredientInfo]);

    useEffect(() => { fetchUserIngredients(); }, [selectedUserId, fetchUserIngredients]);
    useEffect(() => { fetchIngredientInfo(); }, [selectedIngredientId, fetchIngredientInfo]);

    useEffect(() => {
        if (selectedAuthorId || selectedUserId) {

            setFormState(prev => ({
                ...prev,
                selectedUserTagIndexes: []
            }))
        }
    }, [selectedAuthorId, selectedUserId]);


    return (
        <div
            className={`module ${className} ${styles['add-edit-ingredient-module']}`}
            onClick={activate}
            id='add-edit-ingredient-module'
        >
            <header className={`module-header ${styles['header']}`}>
                <AddEditIngredientHeader
                    active={active}
                    mode={mode}
                    error={error}
                    statusMsg={statusMsg}
                    handleModeSelect={handleModeSelect}
                />
            </header>

            {waiting && <><ScreenGuard /></>}
            {active && (
                <>
                    <div className={styles['add-edit-ingredient-body']}>
                        <form id="add-edit-ingredient" onSubmit={handleSubmit}>

                            {mode === 'edit' && (
                                <>
                                    <FormRow className={styles['row-0']} >
                                        <FieldModule label="User" id="edit-ingredient-user-module">
                                            <UserSelect onSelect={handleUserSelect} />
                                        </FieldModule>
                                    </FormRow>

                                    <FormRow className={styles['row-00']} >
                                        <FieldModule label="Ingredient" id="edit-ingredient-ingredient-module">
                                            <IngredientSelect
                                                value={ingredientValue}
                                                data={userReady ? userIngredientList : []}
                                                ready={userReady}
                                                onSelect={handleIngredientSelect}
                                            />
                                        </FieldModule>
                                    </FormRow>
                                </>
                            )}

                            <FormRow className={styles['row-1']}>
                                <FieldModule label="Name*">
                                    <AdminInput name="name"
                                        required disabled={isDisabled}
                                        className={isDisabled ? 'disabled' : ''}
                                        placeholder="e.g. Fingerling Potatoes"
                                        value={formState.name}
                                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-2']} >
                                <FieldModule className={`tags`} label="Season">
                                    <AdminSelect
                                        name="season"
                                        disabled={isDisabled}
                                        defaultValue={formState.seasons}
                                        multiple
                                        onChange={handleSeasonSelect}
                                        options={seasonOptions}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-3']} >
                                <FieldModule label="Main Class">
                                    <AdminInput
                                        name="main"
                                        disabled={isDisabled}
                                        value={formState.main}
                                        placeholder="e.g. Potato"
                                        className={isDisabled ? 'disabled' : ''}
                                        onChange={e => setFormState({ ...formState, main: e.target.value })} />
                                </FieldModule>

                                <FieldModule label="Variety">
                                    <AdminInput
                                        name="variety"
                                        disabled={isDisabled}
                                        value={formState.variety}
                                        placeholder="e.g. Fingerling"
                                        className={isDisabled ? 'disabled' : ''}
                                        onChange={e => setFormState({ ...formState, variety: e.target.value })} />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-4']} >
                                <FieldModule label="Category">
                                    <AdminInput
                                        name="category"
                                        disabled={isDisabled}
                                        value={formState.category}
                                        placeholder="e.g. Vegetable"
                                        className={isDisabled ? 'disabled' : ''}
                                        onChange={e => setFormState({ ...formState, category: e.target.value })}
                                    />
                                </FieldModule>

                                <FieldModule label="Sub Category">
                                    <AdminInput name="subcategory" disabled={isDisabled} value={formState.subcategory}
                                        placeholder="e.g. Root"
                                        className={isDisabled ? 'disabled' : ''}
                                        onChange={e => setFormState({ ...formState, subcategory: e.target.value })} />
                                </FieldModule>
                            </FormRow>
                            <div className={styles["tags-module"]}>

                                <FormRow className={styles['row-5']} >
                                    <FieldModule label="Default-Tags">
                                        <TagsSelect
                                            name="default-tags"
                                            defaultValue={formState.selectedDefaultTagIndexes}
                                            disabled={isDisabled}
                                            onChange={handleDefaultTagSelect}
                                            multiple
                                            type="ingredient"
                                            user={null}
                                        />
                                    </FieldModule>
                                </FormRow>


                                {(selectedAuthorId || selectedUserId) &&
                                    <>
                                        <FormRow className={`${styles['row-6']} ${styles["user-tags"]}`}>
                                            <FieldModule label="User-Tags">
                                                <TagsSelect
                                                    name="user-tags"
                                                    defaultValue={formState.selectedUserTagIndexes}
                                                    disabled={isDisabled}
                                                    onChange={handleUserTagSelect}
                                                    multiple
                                                    type="ingredient"
                                                    user={selectedAuthorId ?? selectedUserId}
                                                    refreshKey={userTagsRefreshKey}
                                                />
                                            </FieldModule>
                                        </FormRow>

                                        <FormRow className={`${styles['add-tags']}`}>
                                            <FieldModule label="Add-Tags">
                                                <AdminInput
                                                    name="add-user-ingredient-tag"
                                                    className="add-tag"
                                                    placeholder="Buy Bulk..."
                                                    onChange={userIngredientTagInputHandler}
                                                    onKeyDown={userIngredientTagKeyDown}
                                                    value={userIngredientTagValue}
                                                />
                                                <div
                                                    className={`${styles["plus-circle-container"]} ${styles['dark']}`}
                                                    onClick={addUserIngredientTag}
                                                >
                                                    <FiPlusCircle />
                                                </div>
                                            </FieldModule>
                                        </FormRow>
                                    </>
                                }

                            </div>


                            <FormRow className={styles['row-']} className={`${mode === 'edit' ? 'padding-top-20' : ''}`}>
                                {mode === 'add' && (
                                    <FieldModule label="User*" id="add-edit-ingredient-user-module">
                                        <UserSelect onSelect={handleAuthorSelect} />
                                    </FieldModule>
                                )}

                                <FieldModule id="add-edit-ingredient-submit-module">
                                    <input disabled={waiting} id="add-edit-ingredient-submit" type="submit" value={toTitleCase(mode)} />
                                </FieldModule>
                            </FormRow>

                            <FormRow className={styles['row-']} >
                                <div className="footnote-container"><span>* Required</span></div>
                            </FormRow>

                        </form>
                    </div>

                    <CloseButton onClick={(e) => { close(e); setMode('add'); resetAll(); }} />
                </>
            )}
        </div>
    );
}
