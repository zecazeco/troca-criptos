import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  const variantClass = variant === 'ghost' ? 'button--ghost' : '';
  return <button type={type} className={`button ${variantClass} ${className}`.trim()} {...props} />;
}

export default Button;
