import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none focus:ring-offset-gray-900";

  const variants = {
    primary: "bg-[#38000A] hover:bg-[#9B1313] text-white focus:ring-[#FFA896]",
    secondary: "bg-[#1a3d70] hover:bg-[#2a5da8] text-white focus:ring-[#3a7bd5]",
    outline: "border-2 border-[#3a7bd5] text-[#3a7bd5] hover:bg-[#00d2ff]/10 hover:text-[#2a5da8] focus:ring-[#00d2ff]",
    ghost: "hover:bg-[#00d2ff]/10 text-gray-600 hover:text-[#3a7bd5]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
