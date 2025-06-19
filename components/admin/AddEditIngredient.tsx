'use client';

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
    IngredientFormState
} from "@/types/types";

import Loader from "@/components/Loader";
import ScreenGuard from "@/components/ScreenGuard";

import FormRow from "@/components/FormRow";
import FieldModule from "@/components/FieldModule";
import CloseButton from "@/components/admin/CloseButton";

import AdminInput from "./AdminInput";
import AdminSelect from "./AdminSelect";
import TagsSelect from "./TagsSelect";
import UserSelect from "./UserSelect";
import IngredientSelect from "./IngredientSelect";
import AddEditIngredientHeader from "./AddEditIngredientHeader";

import { toTitleCase } from "@/utils/utils";


export default function AddEditIngredient({ className, onClick: activate, active, close }: AdminModule) {

    //* STATES
    const [waiting, setWaiting] = useState(false);
    const [tagWaiting, setTagWaiting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const [mode, setMode] = useState<Mode>('add');

    const [userReady, setUserReady] = useState(false);
    const [ingredientReady, setIngredientReady] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null);

    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);

    const [userIngredientList, setUserIngredientList] = useState<Ingredient[]>([]);
    const [ingredientInfo, setIngredientInfo] = useState<Ingredient | null>(null);

    const [userIngredientTagValue, setUserIngredientTagValue] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const [formState, setFormState] = useState<IngredientFormState>({
        name: '',
        main: '',
        variety: '',
        category: '',
        subcategory: '',
        seasons: [],
        defaultTags: [],
        userTags: []
    });

    const isDisabled = mode === 'edit' && !ingredientReady;


    //* FUNCTIONS

    const triggerUserTagRefresh = () => setRefreshKey(prev => prev + 1);

    // Reset everything
    const resetAll = () => {
        setError(null);
        setStatusMsg(null);
        setSelectedUserId(null);
        setUserIngredientList([]);
        setSelectedIngredientId(null);
        setIngredientInfo(null);
        setSelectedAuthorId(null);
        setFormState({ name: '', main: '', variety: '', category: '', subcategory: '', seasons: [], defaultTags: [], userTags: [] });
        setUserReady(false);
        setIngredientReady(false);
    };

    // Handle Season changes
    const handleSeasonSelect = (value: string, checked: boolean) => {
        console.log(value, checked);

        setFormState(prev => ({
            ...prev,
            seasons: checked ? [...prev.seasons, value] : prev.seasons.filter(s => s !== value),
        }));
        console.log(formState.seasons)

    };

    // Default Tags
    const handleDefaultTagSelect = (value: string, checked: boolean) => {
        console.log(value, checked);
        setFormState(prev => ({
            ...prev,
            defaultTags: checked ? [...prev.defaultTags, value] : prev.defaultTags.filter(s => s !== value),
        }));
        console.log(formState.defaultTags)
    };

    const handleUserTagSelect = (value: string, checked: boolean) => {
        console.log(value, checked);
        setFormState(prev => ({
            ...prev,
            userTags: checked ? [...prev.userTags, value] : prev.userTags.filter(s => s !== value),
        }));
        console.log(formState.userTags)
    };


    // User selection (edit mode)
    const handleUserSelect = async (selectedUser: string) => {
        const userId = Number(selectedUser.split(":")[0]);
        if (!isNaN(userId)) {
            setSelectedUserId(userId);
            setUserReady(true);
            setIngredientReady(false);
            setFormState({ name: '', main: '', variety: '', category: '', subcategory: '', seasons: [] });
        } else {
            setUserReady(false);
        }
        setStatusMsg(null);
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
        };

        try {
            const res = await fetch(
                mode === 'add' ? '/api/ingredient' : `/api/ingredient/${selectedIngredientId}`,
                {
                    method: mode === 'add' ? 'POST' : 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include',
                }
            );

            if (!res.ok) {
                const error = await res.json();
                setError(error.error);
            } else {
                const json = await res.json();
                console.log(json);
                setStatusMsg(mode === 'add' ? 'Ingredient Created!' : 'Ingredient Updated!');
                if (mode === 'edit') {
                    setIngredientReady(false);
                    fetchUserIngredients();
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setWaiting(false);
        }
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

        setRefreshKey(prev => prev + 1);
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
        const newTag = await fetch(`/api/tag/ingredient/user/${selectedAuthorId}`, {
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
                seasons: ingredientInfo.seasons ?? [],
                defaultTags: ingredientInfo.defaultTags ?? [],
                userTags: ingredientInfo.userTags ?? []
            });
        }
    }, [ingredientInfo]);
    useEffect(() => { fetchUserIngredients(); }, [selectedUserId, fetchUserIngredients]);
    useEffect(() => { fetchIngredientInfo(); }, [selectedIngredientId, fetchIngredientInfo]);

    useEffect(() => {
        if (selectedAuthorId) {

            setFormState(prev => ({
                ...prev,
                userTags: []
            }))
        }
    }, [selectedAuthorId]);


    return (
        <div className={`module ${className}`} id="add-edit-ingredient-module" onClick={activate}>
            <header>
                <AddEditIngredientHeader
                    active={active}
                    mode={mode}
                    error={error}
                    handleModeSelect={handleModeSelect}
                />
            </header>

            {waiting && <><ScreenGuard /></>}
            {active && (
                <>
                    <div className="add-edit-ingredient-body">
                        <form id="add-edit-ingredient" onSubmit={handleSubmit}>

                            {mode === 'edit' && (
                                <>
                                    <FormRow id="row-0">
                                        <FieldModule label="User" id="edit-ingredient-user-module">
                                            <UserSelect onSelect={handleUserSelect} />
                                        </FieldModule>
                                    </FormRow>

                                    <FormRow id="row-00">
                                        <FieldModule label="Ingredient" id="edit-ingredient-ingredient-module">
                                            <IngredientSelect data={userIngredientList} ready={!userReady} onSelect={handleIngredientSelect} />
                                        </FieldModule>
                                    </FormRow>
                                </>
                            )}

                            <FormRow id="row-1">
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

                            <FormRow id="row-2">
                                <FieldModule label="Season">
                                    <AdminSelect
                                        name="season"
                                        disabled={isDisabled}
                                        defaultValue={formState.seasons}
                                        multiple
                                        onChange={handleSeasonSelect}
                                        options={[
                                            { value: 'fall', label: 'Fall' },
                                            { value: 'winter', label: 'Winter' },
                                            { value: 'spring', label: 'Spring' },
                                            { value: 'summer', label: 'Summer' }
                                        ]}
                                    />
                                </FieldModule>
                            </FormRow>

                            <FormRow id="row-3">
                                <FieldModule label="Main Class">
                                    <AdminInput name="main" disabled={isDisabled} value={formState.main}
                                        placeholder="e.g. Potato"
                                        className={isDisabled ? 'disabled' : ''}
                                        onChange={e => setFormState({ ...formState, main: e.target.value })} />
                                </FieldModule>

                                <FieldModule label="Variety">
                                    <AdminInput name="variety" disabled={isDisabled} value={formState.variety}
                                        placeholder="e.g. Fingerling"
                                        className={isDisabled ? 'disabled' : ''}
                                        onChange={e => setFormState({ ...formState, variety: e.target.value })} />
                                </FieldModule>
                            </FormRow>

                            <FormRow id="row-4">
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
                            <div className="tags-module">

                                <FormRow id="row-5">
                                    <FieldModule label="Default-Tags">
                                        <TagsSelect
                                            name="default-tags"
                                            defaultValue={formState.defaultTags}
                                            disabled={isDisabled}
                                            onChange={handleDefaultTagSelect}
                                            multiple
                                            type="ingredient"
                                            user={null}
                                        />
                                    </FieldModule>
                                </FormRow>


                                {selectedAuthorId &&
                                    <>
                                        <FormRow id="row-6" className="user-tags">
                                            <FieldModule label="User-Tags">
                                                <TagsSelect
                                                    name="user-tags"
                                                    defaultValue={formState.userTags}
                                                    disabled={isDisabled}
                                                    onChange={handleUserTagSelect}
                                                    multiple
                                                    type="ingredient"
                                                    user={selectedAuthorId}
                                                    refreshKey={refreshKey}
                                                />
                                            </FieldModule>
                                        </FormRow>

                                        <FormRow id="row-7" className="add-tags">
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
                                                    className="plus-circle-container"
                                                    onClick={addUserIngredientTag}
                                                >
                                                    <FiPlusCircle />
                                                </div>
                                            </FieldModule>
                                        </FormRow>
                                    </>
                                }

                            </div>


                            <FormRow id="row-8" className={`${mode === 'edit' ? 'padding-top-20' : ''}`}>
                                {mode === 'add' && (
                                    <FieldModule label="User*" id="add-edit-ingredient-user-module">
                                        <UserSelect onSelect={handleAuthorSelect} />
                                    </FieldModule>
                                )}

                                <FieldModule id="add-edit-ingredient-submit-module">
                                    <input disabled={waiting} id="add-edit-ingredient-submit" type="submit" value={toTitleCase(mode)} />
                                    {statusMsg && <div className="status-container"><span>{statusMsg}</span></div>}
                                </FieldModule>
                            </FormRow>

                            <FormRow id="row-9">
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
