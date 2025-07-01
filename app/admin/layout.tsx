import { getUser } from "@/lib/auth";

import PrimeHeader from "@/components/prime/PrimeHeader";

import '@/components/admin/dashboard/dashboard.css';
import { DashboardProvider } from "@/context/DashboardContext";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  const user = await getUser();
  const nickname = user?.nickname;
  const role = user?.role;

  return (
    <>
      <DashboardProvider >
        <PrimeHeader nickname={nickname} role={role} />
        {children}
      </DashboardProvider>
    </>
  );
}
