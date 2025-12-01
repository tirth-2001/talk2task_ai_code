import React from 'react'
import { Link } from 'react-router-dom'

import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

export interface NavItemProps {
  path: string
  label: string
  icon: LucideIcon
  isActive?: boolean
  isCollapsed?: boolean
  className?: string
}

const NavItem: React.FC<NavItemProps> = ({
  path,
  label,
  icon: Icon,
  isActive = false,
  isCollapsed = false,
  className,
}) => {
  return (
    <Link
      to={path}
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
        isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        isCollapsed && 'justify-center',
        className,
      )}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}

export default NavItem
