'use client';

import CloseButton from "@/components/admin/dashboard/CloseButton";
import { AdminReadoutModule } from "@/types/types";
import { useDashboard } from "@/context/DashboardContext";
import Users from "./Users";



export default function DashboardReadoutModule({ title, id, hookData }: AdminReadoutModule) {
    const {
        activeModuleIds: activeIds,
        activateModule: activate,
        deactivateModule: deactivate
    } = useDashboard();

    const isActive = activeIds.includes(id);
    const isLoading = false;

    return (
        <div className={`module ${activeIds.includes(id) ? 'active' : 'inactive'}`} id={id} onClick={() => activate(id)}>
            <div className="module-header">
                <h3>{title}</h3>
                <span className="cat-data-label">total:</span><span className="cat-data"> {isLoading ? '--' : hookData.length}</span>
            </div>
            {active &&
                (<>
                    <div className="module-body">
                        {
                            isLoading
                                ? <div className="DashboardReadoutModule-skeleton"></div>
                                : <Users data={hookData} />
                        }
                    </div>

                    <CloseButton onClick={close} />
                </>
                )}
        </div>
    );
}