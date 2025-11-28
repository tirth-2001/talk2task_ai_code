import React from 'react'
import clsx from 'clsx'

export type IconContainerSize = 'sm' | 'md' | 'lg' | 'xl'

export interface IconContainerProps {
  size?: IconContainerSize
  variant?: 'primary' | 'secondary' | 'neutral'
  children: React.ReactNode
  className?: string
}

const IconContainer: React.FC<IconContainerProps> = ({
  size = 'md',
  variant = 'primary',
  children,
  className,
}) => {
  const baseStyles = 'rounded-lg flex items-center justify-center flex-shrink-0'
  
  const sizeStyles = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-5',
  }
  
  const variantStyles = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-purple-50 text-purple-600',
    neutral: 'bg-gray-100 text-gray-600',
  }
  
  return (
    <div className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}>
      {children}
    </div>
  )
}

export default IconContainer
