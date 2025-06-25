'use client';

import { useEffect, useState } from "react";

import DashboardAddEdit from "./DashboardAddEdit";
import DashboardReadouts from "./readouts/DashboardReadouts";
import styles from "./Dashboard.module.css";
import { useDashboard } from "@/context/DashboardContext";

export default function Dashboard() {


    const { activateModule, deactivateModule, activeModuleIds: activeIds } = useDashboard();


    return (
        <div className={styles["admin-dashboard"]}>
            <header className={styles['header']}>
                <h1>Recipe Database Admin Dashboard</h1>
            </header>

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