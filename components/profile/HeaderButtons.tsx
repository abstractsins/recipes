'use client';

import ProfileButton from "../ProfileButton";
import LogoutButton from "../LogoutButton";
import { useRouter } from "next/navigation";

interface Props {
    role: string | undefined;
    profileView: boolean;
}

export default function HeaderButtons({ role, profileView }: Props) {
    const router = useRouter();

    if (role === undefined) router.push('./login')

    return (
        <div className="header-buttons">
            <ProfileButton role={role} profileView={profileView} />
            <LogoutButton />
        </div>
    );
}