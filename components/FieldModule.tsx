interface FieldModuleProps {
  label?: string;
  children: React.ReactNode;
  id?: string
}

export default function FieldModule({ label, children, id }: FieldModuleProps) {
  return (
    <div className={`form-module ${label?.toLowerCase()}`} id={id || ''}>
      {label && (
        <div className="field-label">
          <span>{label}</span>
        </div>
      )}
      <div className="field-container">
        {children}
      </div>
    </div>
  )
}
