import React from 'react'
import { GitFork, Check, X } from 'lucide-react'
import WorkflowNode from '../atoms/WorkflowNode'

interface BranchNodeProps {
  data: any
  isSelected: boolean
  error?: string
  onConfigClick: (e: React.MouseEvent) => void
  onDeleteClick: (e: React.MouseEvent) => void
  truePath: React.ReactNode
  falsePath: React.ReactNode
}

export const BranchNode: React.FC<BranchNodeProps> = ({
  data,
  isSelected,
  error,
  onConfigClick,
  onDeleteClick,
  truePath,
  falsePath,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Main Branch Header Node */}
      <div className="mb-4 relative z-10">
        <WorkflowNode
          icon={<GitFork size={20} />}
          title={data.label || 'Condition'}
          description={data.description || 'If/Else Logic'}
          isSelected={isSelected}
          error={error}
          onConfigClick={onConfigClick}
          onDeleteClick={onDeleteClick}
        />
      </div>

      {/* Branches Container */}
      <div className="flex gap-4 w-full relative pt-6">
        {/* Connecting Lines */}
        {/* Vertical line from parent */}
        <div className="absolute top-0 left-1/2 w-[2px] h-6 bg-gray-300 -translate-y-4 -translate-x-1/2 z-0"></div>
        
        {/* Horizontal connecting line */}
        <div className="absolute top-2 left-1/4 right-1/4 h-[2px] bg-gray-300"></div>
        
        {/* Vertical lines to children */}
        <div className="absolute top-2 left-1/4 w-[2px] h-4 bg-gray-300 -translate-x-1/2"></div>
        <div className="absolute top-2 right-1/4 w-[2px] h-4 bg-gray-300 translate-x-1/2"></div>

        {/* True Path */}
        <div className="flex-1 flex flex-col min-w-[200px]">
          <div className="flex items-center justify-center gap-2 my-2">
            <div className="w-6 h-6 rounded-full bg-green-100/60 text-green-700 flex items-center justify-center text-xs font-bold border border-green-200 shadow-sm">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">True</span>
          </div>
          <div className="flex-1 bg-green-100/60 rounded-xl border-2 border-green-200 p-3 min-h-[100px] shadow-sm">
            {truePath}
          </div>
        </div>

        {/* False Path */}
        <div className="flex-1 flex flex-col min-w-[200px]">
          <div className="flex items-center justify-center gap-2 my-2">
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold border border-red-200 shadow-sm">
              <X size={14} strokeWidth={3} />
            </div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">False</span>
          </div>
          <div className="flex-1 bg-red-50 rounded-xl border-2 border-red-100 p-3 min-h-[100px] shadow-sm">
            {falsePath}
          </div>
        </div>
      </div>
    </div>
  )
}
