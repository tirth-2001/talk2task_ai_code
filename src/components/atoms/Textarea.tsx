import React from 'react'

import clsx from 'clsx'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  fullWidth?: boolean
  minHeight?: string
}

const Textarea: React.FC<TextareaProps> = ({
  error = false,
  fullWidth = true,
  minHeight = 'min-h-64',
  className,
  ...props
}) => {
  const baseStyles =
    'resize-y overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 border bg-white text-base font-normal leading-normal p-4'
  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50'
    : 'border-gray-200 focus:border-primary/50 focus:ring-primary/50'
  const widthStyles = fullWidth ? 'w-full' : ''

  return <textarea className={clsx(baseStyles, stateStyles, widthStyles, minHeight, className)} {...props} />
}

export default Textarea
