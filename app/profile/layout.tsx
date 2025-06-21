import { getUser } from '@/lib/auth'

import Greeting from '@/components/prime/Greeting';
import HeaderButtons from "@/components/profile/HeaderButtons";

export const dynamic = 'force-dynamic';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {

    const user = await getUser();
    const nickname = user?.nickname;
    const role = user?.role;


    return (
        <div id="profile-layout">
            <header>
                <Greeting nickname={nickname} />
                <HeaderButtons role={role} profileView={true} />
            </header>
            {children}
        </div>
    );
}
