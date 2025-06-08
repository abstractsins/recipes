import { RiCloseFill } from "react-icons/ri";

interface CloseButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export default function CloseButton({ onClick, className = "" }: CloseButtonProps) {
  return (
    <div className={`close-btn ${className}`} onClick={onClick}>
      <RiCloseFill />
    </div>
  );
}
