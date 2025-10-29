import styles from './page.module.css';

import Dashboard from "@/components/admin/dashboard/Dashboard";

export default function Admin() {
  return (
    <div className={styles.wrapper}>
      <Dashboard />
    </div>
  );
}
