'use client';

import { useRouter } from 'next/navigation';
import { MdLogout } from "react-icons/md";
import styles from './LogoutButton.module.css';

interface Props {
  theme: string;
}

export default function LogoutButton({ theme }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <span className={`link ${theme} ${styles['logout']}`} onClick={handleLogout}>Logout <MdLogout /></span>
  );
}