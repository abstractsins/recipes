import { RiAdminFill } from "react-icons/ri";

import { redirect } from 'next/navigation'

import Link from "next/link";
import { RiUser3Fill } from "react-icons/ri";

interface Props {
    role: string | undefined;
    profileView: boolean;
}

export default function ProfileButton({ role, profileView }: Props) {

    console.log(role);

    if (!role) redirect('/login');

return (
    <>
        {
            role === "admin" && profileView === true
                ? <Link href="./admin"><span className="link"><RiAdminFill /> Admin Portal</span></Link>
                : <Link href="./profile"><span className="link"><RiUser3Fill /> Profile</span></Link>
        }

    </>
);
}