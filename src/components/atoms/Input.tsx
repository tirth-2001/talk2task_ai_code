import React from 'react'
import clsx from 'clsx'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  fullWidth?: boolean
}

const Input: React.FC<InputProps> = ({ error = false, fullWidth = true, className, ...props }) => {
  const baseStyles = 'rounded-lg text-gray-900 focus:outline-0 focus:ring-2 border bg-white text-base font-normal leading-normal px-4 h-10'
  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50'
    : 'border-gray-200 focus:border-primary/50 focus:ring-primary/50'
  const widthStyles = fullWidth ? 'w-full' : ''
  
  return (
    <input
      className={clsx(baseStyles, stateStyles, widthStyles, className)}
      {...props}
    />
  )
}

export default Input
