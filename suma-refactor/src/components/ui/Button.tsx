import { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  className?: string;
  disabled?: boolean;
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[#7FB3D5] text-white hover:bg-[#6FA3C5]',
  secondary: 'bg-[#A8BA9A] text-white hover:bg-[#99AA8B]',
  accent: 'bg-[#E5B7B7] text-[#5A4A4A] hover:bg-[#D9A5A5]',
  ghost: 'bg-transparent text-[#6B7280] hover:bg-[#F4F1EC]',
  outline: 'bg-transparent border-2 border-[#EFEAE4] text-[#3A4145] hover:bg-[#F4F1EC]',
};

export function Button({ children, onClick, variant = 'primary', className = '', disabled = false }: ButtonProps) {
  const base = 'px-6 py-3 rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-sm';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
