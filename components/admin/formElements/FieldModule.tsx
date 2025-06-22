import { stripSpecialChars } from "@/utils/utils";
import { toTitleCase } from "@/utils/utils";

import styles from './FieldModule.module.css';

interface FieldModuleProps {
  label?: string;
  children: React.ReactNode;
  id?: string
}

export default function FieldModule({ label, children, id }: FieldModuleProps) {

  let title = 'null';
  if (label) {
    title = stripSpecialChars(label);
    title = toTitleCase(title);
  }

  return (
    <div className={`${styles['form-module']} ${label?.toLowerCase()}`} id={id ?? ''}>
      {label && (
        <div className="field-label">
          <span>{title}</span>
        </div>
      )}
      <div className={styles["field-container"]}>
        {children}
      </div>
    </div>
  )
}
