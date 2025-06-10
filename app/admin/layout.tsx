import { getUser } from "@/lib/auth";

import PrimeHeader from "@/components/prime/PrimeHeader";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  const user = await getUser();
  const nickname = user?.nickname;
  const role = user?.role;

  return (
    <>
      <PrimeHeader nickname={nickname} role={role} />
      {children}
    </>
  );
}
