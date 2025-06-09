import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

import type { Metadata } from "next";
import PrimeHeader from "@/components/prime/PrimeHeader";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Recipes",
  description: "Recipe database",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  const user = await getUser();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/unauthorized');
  const nickname = user.nickname;

  return (
    <>
      <PrimeHeader nickname={nickname} />
      {children}
    </>
  );
}
