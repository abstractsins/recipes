'use client';

//* --------------------------------------- //
//* -----------------IMPORTS--------------- //
//* --------------------------------------- //

//* STYLES
import styles from './AddEditTags.module.css';

//* ICONS
import { FiPlusCircle } from "react-icons/fi";

//* REACT
import { useEffect, useState } from "react";

//* TYPES
import { Mode, AdminAddEditModule } from "@/types/types";

//* COMPONENTS
import ScreenGuard from "@/components/general/ScreenGuard";
import InputSpinner from "@/components/general/InputSpinner";

import FormRow from "@/components/admin/formElements/FormRow";
import FieldModule from "@/components/admin/formElements/FieldModule";
import CloseButton from "@/components/admin/dashboard/CloseButton";

import AdminInput from "../formElements/AdminInput";
import AdminMultiSelect from "../formElements/AdminMultiSelect";
import TagsSelect from "../TagsSelect";
import UserSelect from "../formElements/UserSelect";
import IngredientSelect from "../formElements/IngredientSelect";
import AddEditHeader from "./AddEditHeader";

//* UTILS
import {
    seasonOptions,
    toTitleCase,
    handleModeSelectFactory,
    handleSeasonSelect,
    handleTagSelectFactory
} from "@/utils/utils";

//* HOOKS
import { useIngredientForm } from '@/hooks/useIngredientForm';
import useTagForm from '@/hooks/useTagForm';

//* CONTEXT
import { useDashboard } from '@/context/DashboardContext';



//* --------------------------------------- //
//* -----------------EXPORTS--------------- //
//* --------------------------------------- //

export default function AddEditTags({
    id,
    title,
    isActive,
    onClick,
    close
}: AdminAddEditModule) {


    //* -----------------STATES--------------- //

    const [mode, setMode] = useState<Mode>('add');

    const {
        formState, setFormState,
        handleSubmit,
        error, successMsg, warningMsg, instructionMsg,
        submitWaiting,
        resetAll,
    } = useTagForm(mode);

    const { } = useDashboard();

    const handleModeSelect = handleModeSelectFactory(setMode, resetAll);


    //* -----------------RETURN--------------- //

    return (
        <div
            className={`module ${styles['module']} ${isActive ? styles['active'] : styles['inactive']} ${styles['add-edit-ingredient-module']}`}
            onClick={onClick}
            id={id}
        >
            <header className={`${styles['module-header']} ${styles['header']}`}>
                <AddEditHeader
                    title={title}
                    active={isActive}
                    mode={mode}
                    error={error}
                    successMsg={successMsg}
                    warningMsg={warningMsg}
                    instructionMsg={instructionMsg}
                    handleModeSelect={handleModeSelect}
                />
            </header>

            {isActive && (
                <>
                    <CloseButton onClick={(e) => { close(e); setMode('add'); resetAll() }} />
                </>
            )}

        </div>
    );
}