'use client';

import ProfileButton from "@/components/profile/ProfileButton";
import LogoutButton from "@/components/profile/LogoutButton";
import { useRouter } from "next/navigation";

import styles from './HeaderButtons.module.css';

interface Props {
    role: string | undefined;
    profileView: boolean;
}

export default function HeaderButtons({ role, profileView }: Props) {
    const router = useRouter();

    if (role === undefined) router.push('./login')

    return (
        <div className={styles["header-buttons"]}>
            <ProfileButton role={role} profileView={profileView} />
            <LogoutButton />
        </div>
    );
}