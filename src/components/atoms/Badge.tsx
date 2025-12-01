import React from 'react'

import clsx from 'clsx'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', dot = false, children, className }) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full'

  const variantStyles = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-gray-100 text-gray-600',
  }

  return (
    <span className={clsx(baseStyles, variantStyles[variant], className)}>
      {dot && <span className="mr-1">●</span>}
      {children}
    </span>
  )
}

export default Badge
