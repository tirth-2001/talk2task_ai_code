import React from 'react'
import clsx from 'clsx'

export interface TabButtonProps {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

const TabButton: React.FC<TabButtonProps> = ({ active = false, onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 transition-colors',
        active
          ? 'border-b-primary text-primary'
          : 'border-b-transparent text-gray-500 hover:text-gray-700',
        className
      )}
    >
      <p className="text-sm font-bold tracking-wide">{children}</p>
    </button>
  )
}

export default TabButton
