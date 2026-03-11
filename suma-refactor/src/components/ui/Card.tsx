import { type ReactNode } from 'react';

/*
 * A card is a boundary, not a container.
 * It groups related information through proximity and a thin border.
 * No background fill change. No shadow. No border-radius theatre.
 * The content defines the card, not the other way around.
 */

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`border border-[#D5CFC6] rounded p-4 ${onClick ? 'cursor-pointer hover:border-[#4A3C2E] transition-colors duration-100' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
