'use client';

import { useRouter } from 'next/navigation';
import { MdLogout } from "react-icons/md";
import styles from './LogoutButton.module.css';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <span className={`link ${styles['logout']}`} onClick={handleLogout}>Logout <MdLogout /></span>
  );
}