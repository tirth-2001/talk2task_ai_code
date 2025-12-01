import React from 'react'

import clsx from 'clsx'

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card: React.FC<CardProps> = ({ children, className, hover = false, onClick, padding = 'md' }) => {
  const baseStyles = 'bg-white rounded-xl border border-gray-200 transition-all'
  const hoverStyles = hover ? 'hover:shadow-md hover:border-primary cursor-pointer' : ''
  const clickableStyles = onClick ? 'cursor-pointer' : ''

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={clsx(baseStyles, hoverStyles, clickableStyles, paddingStyles[padding], className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
