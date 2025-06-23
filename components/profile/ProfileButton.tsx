import { RiAdminFill } from "react-icons/ri";

import { redirect } from 'next/navigation'

import Link from "next/link";
import { RiUser3Fill } from "react-icons/ri";

import styles from './ProfileButton.module.css';

interface Props {
    theme: string;
    role: string | undefined;
    profileView: boolean;
}

export default function ProfileButton({ theme, role, profileView }: Props) {

    if (!role) redirect('/login');

    return (
        <>
            {
                role === "admin" && profileView === true
                    ? <Link href="./admin"><span className={`link ${theme} ${styles["profile-btn"]}`}>Admin Portal <RiAdminFill /> </span></Link>
                    : <Link href="./profile"><span className={`link ${theme} ${styles["profile-btn"]}`}>Profile <RiUser3Fill /> </span></Link>
            }

        </>
    );
}