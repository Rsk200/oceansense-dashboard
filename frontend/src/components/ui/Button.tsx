import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95';
    
    const variants = {
      primary: 'bg-gradient-to-r from-accent to-accent-light text-primary hover:shadow-lg hover:shadow-accent/30',
      secondary: 'glass text-white hover:bg-white/20',
      ghost: 'text-white hover:bg-white/10',
      danger: 'bg-danger text-white hover:bg-red-600',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
