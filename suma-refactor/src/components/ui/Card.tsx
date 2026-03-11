import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-[#EFEAE4] rounded-[2rem] shadow-sm ${className}`}>
      {children}
    </div>
  );
}
