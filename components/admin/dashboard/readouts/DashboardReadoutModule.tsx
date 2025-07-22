'use client';

import React from "react";
import CloseButton from "@/components/admin/dashboard/CloseButton";
import { AdminReadoutModule } from "@/types/types";
import { useDashboard } from "@/context/DashboardContext";
import { useEffect } from "react";

import Entries from "./Entries";

import styles from './DashboardReadoutModule.module.css';
import ReadoutSpinner from "@/components/general/ReadoutSpinner";

function DashboardReadoutModule({
    id,
    title,
    hookData,
    isLoading,
    isActive
}: AdminReadoutModule) {

    const {
        activateModule: activate,
        deactivateModule: deactivate,
    } = useDashboard();

    
    return (
        <div
            className={`module ${styles['module']} ${isActive ? styles['active'] : styles['inactive']}`}
            id={id}
            onClick={activate}
        >
            <div className={styles["module-header"]}>
                <h3>{title}</h3>
                <div className={styles["module-subheader"]}>
                    <span className={styles["cat-data-label"]}>total: </span>
                    <span className={styles["cat-data"]}>
                        {isLoading ? <ReadoutSpinner /> : hookData?.length}
                    </span>
                </div>
            </div>
            {isActive &&
                (<>
                    <div className={styles["module-body"]}>
                        {
                            isLoading
                                ? <div className="DashboardReadoutModule-skeleton"></div>
                                : <Entries data={hookData} />
                        }
                    </div>

                    <CloseButton onClick={deactivate} />
                </>)}
        </div>
    );
}

function areEqual(prevProps: any, nextProps: any) {
    return (
        prevProps.id === nextProps.id &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.hookData === nextProps.hookData
    );
}

export default React.memo(DashboardReadoutModule, areEqual);