'use client';

import styles from "./Dashboard.module.css";

import { useEffect, useState } from "react";

import DashboardAddEdit from "./DashboardAddEdit";
import DashboardReadouts from "./readouts/DashboardReadouts";
import { useDashboard } from "@/context/DashboardContext";

export default function Dashboard() {


    const {
        activateModule,
        deactivateModule,
        setActiveModuleIds,
        activeModuleIds: activeIds,
    } = useDashboard();


        //* ----------------FUNCTIONS------------- //
    
        const collapseAll = () => { setActiveModuleIds([]) };
    


    return (
        <div className={styles["admin-dashboard"]}>
            <header className={styles['header']}>
                <h1>Recipe Database Admin Dashboard</h1>
            </header>

            <div>
                <input
                    className={styles["collapse-all"]}
                    type='button'
                    value="Collapse All"
                    onClick={collapseAll}
                />
            </div>

            <div className={styles["body"]}>

                <DashboardAddEdit
                    activeIds={activeIds}
                    onClick={activateModule}
                    close={deactivateModule}
                />

                <DashboardReadouts
                    activeIds={activeIds}
                    onClick={activateModule}
                    close={deactivateModule}
                />

            </div>

        </div>
    );
}