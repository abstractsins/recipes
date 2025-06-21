'use client';

import { useRouter } from 'next/navigation';
import { MdLogout } from "react-icons/md";


export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <span className="link logout" onClick={handleLogout}>Logout <MdLogout /></span>
  );
}