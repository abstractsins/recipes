'use client';

import React from "react";
import CloseButton from "@/components/admin/dashboard/CloseButton";
import { AdminReadoutModule } from "@/types/types";
import { useDashboard } from "@/context/DashboardContext";
import { useEffect } from "react";

import Entries from "./Entries";

import styles from './DashboardReadoutModule.module.css';

function DashboardReadoutModule({ title, id, hookData, isActive }: AdminReadoutModule) {

    const {
        activateModule: activate,
        deactivateModule: deactivate
    } = useDashboard();

    const isLoading = false; // DEBUG?

    return (
        <div
            className={`module ${styles['module']} ${isActive ? styles['active'] : styles['inactive']}`}
            id={id}
            onClick={activate}
        >
            <div className={styles["module-header"]}>
                <h3>{title}</h3>    
                <span className="cat-data-label">total:</span><span className="cat-data"> {isLoading ? '--' : hookData?.length}</span>
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