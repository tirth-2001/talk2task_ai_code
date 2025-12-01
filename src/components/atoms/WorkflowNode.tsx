import React, { useState, useRef, useEffect } from 'react'

import { MoreVertical, Settings, Trash2 } from 'lucide-react'

interface WorkflowNodeProps {
  icon: React.ReactNode
  title: string
  description: string
  onConfigClick?: (e: React.MouseEvent) => void
  onDeleteClick?: (e: React.MouseEvent) => void
  isSelected?: boolean
  error?: string
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  icon,
  title,
  description,
  onConfigClick,
  onDeleteClick,
  isSelected,
  error,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  return (
    <div
      className={`
        relative flex items-center gap-3 p-4 rounded-xl border-2 bg-white transition-all w-full group
        ${isSelected ? 'border-primary ring-2 ring-primary/20 shadow-lg z-10' : 'border-gray-200 hover:border-primary/50 hover:shadow-md'}
        ${error ? 'border-red-500 ring-2 ring-red-500/20' : ''}
      `}
      onClick={onConfigClick}
    >
      {error && (
        <div className="absolute -top-3 right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm z-20">
          {error}
        </div>
      )}
      <div className="text-gray-800 text-2xl flex-shrink-0">{icon}</div>
      <div className="flex flex-col flex-grow min-w-0">
        <h4 className="text-gray-900 font-semibold text-sm truncate">{title}</h4>
        <p className="text-gray-500 text-xs truncate">{description}</p>
      </div>

      {/* Actions Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={handleMenuClick}
          className={`p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-primary/5 transition-all ${
            isSelected || showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <MoreVertical size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(false)
                onConfigClick?.(e)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors text-left"
            >
              <Settings size={14} />
              Settings
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(false)
                onDeleteClick?.(e)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkflowNode
