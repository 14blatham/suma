import { type ReactNode } from 'react';

interface CardProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div onClick={onClick} className={`bg-[#EDE6D6] border border-[#D6CCB8] rounded-xl ${className}`}>
      {children}
    </div>
  );
}
