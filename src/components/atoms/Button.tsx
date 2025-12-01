import React from 'react'

import clsx from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondary:
      'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed',
    text: 'bg-transparent text-primary hover:underline focus:ring-primary/30 disabled:text-gray-400 disabled:cursor-not-allowed',
  }

  const sizeStyles = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
  }

  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], widthStyles, className)}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children && <span className={clsx(fullWidth && 'truncate')}>{children}</span>}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  )
}

export default Button
