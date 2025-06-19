'use client';

import { useEffect, useState } from "react";

import Users from "./Users";
import CloseButton from "./CloseButton";

import { User, AdminModule } from "@/types/types";

export default function UsersModule({ className, onClick: activate, active, close }: AdminModule) {

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);


    //* ------------------------------------------
    //* 👥 FETCH USERS
    //* ------------------------------------------
    useEffect(() => {
        const fetchUsers = async() => {
            try {
                const res = await fetch('/api/user');
                const data: User[] = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUsers();
    }, []);

    return (
        <div className={`module ${className}`} id="users-module" onClick={activate}>
            <div className="module-header">
                <h3>Users</h3>
                <span className="cat-data-label">total:</span><span className="cat-data"> {isLoading ? '--' : users.length}</span>
            </div>
            {active &&
                (<>
                    <div className="module-body">
                        {
                            isLoading
                                ? <div className="users-skeleton"></div>
                                : <Users data={users} />
                        }
                    </div>

                    <CloseButton onClick={close} />
                </>
                )}
        </div>
    );
}