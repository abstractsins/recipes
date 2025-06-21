'use client';

import { useEffect, useState } from "react";

import DashboardAddEdit from "./DashboardAddEdit";
import DashboardReadouts from "./DashboardReadouts";


export default function Dashboard() {

    const [activeIds, setActiveIds] = useState<string[]>([]);

    const activate = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const id = target.closest('.module')?.getAttribute('id');
        let updatedActiveIds = activeIds.slice();
        console.log(id);
        if (id && !activeIds.includes(id)) {
            updatedActiveIds.push(id);
            setActiveIds(updatedActiveIds);
        }
    }

    const deactivate = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const id = target.closest('.module')?.getAttribute('id');
        if (id && activeIds.includes(id)) {
            let updatedActiveIds = activeIds.slice();
            const iActive = activeIds.indexOf(id);
            updatedActiveIds.splice(iActive, 1);
            setActiveIds(updatedActiveIds);
        }
    }

    return (
        <div className="admin-dashboard">
            <header>
                <h1>Recipe Database Admin Dashboard</h1>
            </header>

            <div className="body">

                <DashboardAddEdit
                    activeIds={activeIds}
                    onClick={activate}
                    close={deactivate}
                />

                <DashboardReadouts
                    activeIds={activeIds}
                    onClick={activate}
                    close={deactivate}
                />

            </div>

        </div>
    );
}