import React from 'react'
import clsx from 'clsx'
import IconContainer from '../atoms/IconContainer'

export interface PageHeaderProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={clsx('flex items-start justify-between gap-4', className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {icon && <IconContainer size="sm">{icon}</IconContainer>}
          <h1 className="text-3xl font-black tracking-tight text-gray-900">{title}</h1>
        </div>
        {description && <p className="text-base text-gray-500">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

export default PageHeader
