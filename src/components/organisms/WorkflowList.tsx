import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { ArrowDown } from 'lucide-react'
import { BranchNode } from '../molecules/BranchNode'
import { WorkflowNode } from '../atoms'

// We need to define this here or import it. Ideally import from a shared types file.
// For now, assuming the shape matches what we expect.
interface WorkflowItemData {
  id: string
  type: string
  label: string
  icon: React.ReactNode
  description?: string
  instanceId: string
  config?: Record<string, any>
  branches?: {
    true: WorkflowItemData[]
    false: WorkflowItemData[]
  }
}

interface WorkflowListProps {
  items: WorkflowItemData[]
  listId: string
  selectedNodeId: string | null
  errors?: Record<string, string>
  onConfigClick: (instanceId: string, e: React.MouseEvent) => void
  onDeleteClick: (instanceId: string, e: React.MouseEvent) => void
}

export const WorkflowList: React.FC<WorkflowListProps> = ({
  items,
  listId,
  selectedNodeId,
  errors = {},
  onConfigClick,
  onDeleteClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: listId,
    data: { type: 'container', listId },
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col items-center w-full min-h-[100px] transition-colors rounded-xl p-4 ${
        isOver ? 'bg-primary/10 ring-2 ring-primary/30' : ''
      }`}
    >
      {items.length === 0 && (
        <div className="text-gray-400 text-lg text-center border-2 border-dashed border-gray-300 rounded-lg p-4 w-full">
          Drop items here
        </div>
      )}

      {items.map((node, index) => (
        <React.Fragment key={node.instanceId}>
          <div className="relative group w-full z-10">
            {node.type === 'branch' ? (
              <BranchNode
                data={node}
                isSelected={selectedNodeId === node.instanceId}
                error={errors[node.instanceId]}
                onConfigClick={(e) => onConfigClick(node.instanceId, e)}
                onDeleteClick={(e) => onDeleteClick(node.instanceId, e)}
                truePath={
                  <WorkflowList
                    items={node.branches?.true || []}
                    listId={`${node.instanceId}-true`}
                    selectedNodeId={selectedNodeId}
                    errors={errors}
                    onConfigClick={onConfigClick}
                    onDeleteClick={onDeleteClick}
                  />
                }
                falsePath={
                  <WorkflowList
                    items={node.branches?.false || []}
                    listId={`${node.instanceId}-false`}
                    selectedNodeId={selectedNodeId}
                    errors={errors}
                    onConfigClick={onConfigClick}
                    onDeleteClick={onDeleteClick}
                  />
                }
              />
            ) : (
              <WorkflowNode
                icon={node.icon}
                title={node.label}
                description={node.description || ''}
                isSelected={selectedNodeId === node.instanceId}
                error={errors[node.instanceId]}
                onConfigClick={(e) => onConfigClick(node.instanceId, e)}
                onDeleteClick={(e) => onDeleteClick(node.instanceId, e)}
              />
            )}
          </div>
          {index < items.length - 1 && (
            <div className="flex flex-col items-center h-8 justify-center">
              <div className="w-[2px] h-full bg-gray-300"></div>
              <div className="text-gray-300 -mt-2 z-0">
                <ArrowDown size={20} />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
