import { type ReactNode } from 'react';

/*
 * A button communicates its purpose through:
 *   1. Its label — which must be honest and precise
 *   2. Its visual weight — primary/secondary/ghost
 *   3. Its boundary — border makes it findable without demanding attention
 *
 * No shadows. No scale transforms. No colour drama.
 * The cursor change and border colour shift are sufficient.
 */

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-[#4A3C2E] text-[#F7F4EF] border border-[#4A3C2E] hover:bg-[#362C21] hover:border-[#362C21]',
  secondary: 'bg-transparent text-[#1C1A18] border border-[#D5CFC6] hover:border-[#4A3C2E]',
  ghost:     'bg-transparent text-[#6B6459] border border-transparent hover:text-[#1C1A18]',
};

export function Button({
  children, onClick, variant = 'primary', className = '', disabled = false, type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded
        text-sm font-medium
        transition-colors duration-100
        disabled:opacity-40 disabled:cursor-not-allowed
        cursor-pointer
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </button>
  );
}
