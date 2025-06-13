interface FormRowProps {
  id?: string;
  children: React.ReactNode;
}

export default function FormRow({ id, children }: FormRowProps) {
  return (
    <div className="row" id={id}>
      {children}
    </div>
  );
}
