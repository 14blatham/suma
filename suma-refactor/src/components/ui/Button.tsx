import { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-[#8B7355] text-[#F5F0E8] hover:bg-[#7A6347]',
  secondary: 'bg-[#EDE6D6] text-[#2C2420] hover:bg-[#D6CCB8]',
  accent:    'bg-[#C4956A] text-white hover:bg-[#B5844F]',
  ghost:     'bg-transparent text-[#7A6B5D] hover:bg-[#EDE6D6]',
  outline:   'bg-transparent border border-[#D6CCB8] text-[#2C2420] hover:bg-[#EDE6D6]',
};

export function Button({
  children, onClick, variant = 'primary', className = '', disabled = false, type = 'button',
}: ButtonProps) {
  const base = 'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 flex items-center justify-center gap-2';
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
