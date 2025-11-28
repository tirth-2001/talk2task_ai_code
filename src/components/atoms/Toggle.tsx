import React from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  leftLabel?: string
  rightLabel?: string
  className?: string
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, leftLabel, rightLabel, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {leftLabel && <span className="text-sm text-gray-600">{leftLabel}</span>}
      <label className={`relative flex h-[26px] w-[44px] cursor-pointer items-center rounded-full border-none p-0.5 ${checked ? 'bg-primary' : 'bg-gray-400'}`}>
        <div
          className={`size-[18px] rounded-full bg-white transition-transform ${
            checked ? 'translate-x-[20px]' : 'translate-x-[2px]'
          }`}
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px',
          }}
        />
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="invisible absolute"
        />
      </label>
      {rightLabel && <span className="text-sm text-gray-600">{rightLabel}</span>}
    </div>
  )
}

export default Toggle
