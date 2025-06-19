interface FormRowProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export default function FormRow({ id, className='', children }: FormRowProps) {
  return (
    <div className={`row ${className}`} id={id}>
      {children}
    </div>
  );
}
