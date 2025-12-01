import React from 'react'

import clsx from 'clsx'

import IconContainer from '../atoms/IconContainer'

export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
  className?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onClick, className }) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 text-center cursor-pointer hover:border-primary hover:shadow-lg transition-all',
        className,
      )}
      onClick={onClick}
    >
      <IconContainer size="md">{icon}</IconContainer>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}

export default FeatureCard
