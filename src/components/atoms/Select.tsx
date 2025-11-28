import React from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: (string | SelectOption)[]
  label?: string
  error?: string
  fullWidth?: boolean
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  error,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none'
  const widthStyles = fullWidth ? 'w-full' : 'w-auto'
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : ''

  return (
    <div className={`${widthStyles} flex flex-col gap-1.5`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <select
          className={`${baseStyles} ${errorStyles} ${className}`}
          disabled={disabled}
          {...props}
        >
          {options.map((option, index) => {
            const isString = typeof option === 'string'
            const value = isString ? option : option.value
            const label = isString ? option : option.label
            return (
              <option key={index} value={value}>
                {label}
              </option>
            )
          })}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default Select
