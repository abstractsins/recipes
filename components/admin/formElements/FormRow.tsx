import styles from './FormRow.module.css';

interface FormRowProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export default function FormRow({ id, className = '', children }: FormRowProps) {
  return (
    <div className={`${styles['row']} ${styles[className]}`} id={id}>
      {children}
    </div>
  );
}