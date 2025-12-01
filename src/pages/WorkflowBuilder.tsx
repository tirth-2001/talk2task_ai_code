import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  DndContext,
  DragOverlay,
  useDraggable,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  FileText,
  MessageSquare,
  Mail,
  CalendarDays,
  CheckSquare,
  AlertTriangle,
  Smile,
  Brain,
  Slack,
  Database,
  Globe,
  Zap,
  GitFork,
  ArrowLeft,
  Edit2,
} from 'lucide-react'

import { Button, Toggle, NodeConfigPanel, WorkflowList } from '@/components'
import { useToast } from '@/context/ToastContext'
import { validationService } from '@/services/validationService'
import { type Workflow, workflowService } from '@/services/workflowService'
import { countWorkflowNodes } from '@/utils/workflowUtils'

// Types
interface SidebarItemData {
  id: string
  type: 'trigger' | 'action' | 'ai' | 'source' | 'branch'
  label: string
  icon: React.ReactNode
  description?: string
}

interface WorkflowItemData extends SidebarItemData {
  instanceId: string
  config?: Record<string, any>
  branches?: {
    true: WorkflowItemData[]
    false: WorkflowItemData[]
  }
}

// Draggable Sidebar Item Component
const DraggableSidebarItem: React.FC<{ item: SidebarItemData }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    data: item,
  })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white cursor-grab hover:border-primary hover:bg-primary/5 transition-colors touch-none"
    >
      <span className="text-primary">{item.icon}</span>
      <span className="text-gray-800 text-sm font-medium">{item.label}</span>
    </div>
  )
}

const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const workflowId = searchParams.get('id')
  const { showToast } = useToast()

  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [isEnabled, setIsEnabled] = useState(true)
  const [nodes, setNodes] = useState<WorkflowItemData[]>([])
  const [activeItem, setActiveItem] = useState<SidebarItemData | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isEditingName, setIsEditingName] = useState(false)

  // Load workflow on mount
  useEffect(() => {
    if (workflowId) {
      const savedWorkflow = workflowService.getWorkflow(workflowId)
      if (savedWorkflow) {
        setWorkflowName(savedWorkflow.name)
        setIsEnabled(savedWorkflow.isEnabled)
        // Reconstruct icons for nodes since they are not serializable
        // Note: This needs to be recursive for branches, but for now flat reconstruction is the first step
        // We'll need a recursive rehydrator for full support
        const rehydrateNodes = (nodes: any[]): WorkflowItemData[] => {
          return nodes.map((node) => {
            const originalItem = [...inputSources, ...aiMagic, ...actions, ...logic].find((i) => i.id === node.id)
            const rehydrated: WorkflowItemData = {
              ...node,
              icon: originalItem ? originalItem.icon : <Zap size={20} />,
            }
            if (node.branches) {
              rehydrated.branches = {
                true: rehydrateNodes(node.branches.true),
                false: rehydrateNodes(node.branches.false),
              }
            }
            return rehydrated
          })
        }
        setNodes(rehydrateNodes(savedWorkflow.nodes))
      }
    }
  }, [workflowId])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  )

  // Building block items
  const inputSources: SidebarItemData[] = [
    {
      id: 'source-meeting-summary',
      type: 'trigger',
      label: 'Meeting Summary',
      icon: <FileText size={20} />,
      description: 'Triggered when a meeting summary is available',
    },
    {
      id: 'source-notes',
      type: 'trigger',
      label: 'Notes / Transcripts',
      icon: <MessageSquare size={20} />,
      description: 'Triggered when new notes are added',
    },
    {
      id: 'source-chat',
      type: 'trigger',
      label: 'Chat Messages',
      icon: <MessageSquare size={20} />,
      description: 'Triggered by specific chat messages',
    },
    {
      id: 'source-email',
      type: 'trigger',
      label: 'Email',
      icon: <Mail size={20} />,
      description: 'Triggered by incoming emails',
    },
    {
      id: 'source-calendar',
      type: 'trigger',
      label: 'Calendar Event',
      icon: <CalendarDays size={20} />,
      description: 'Triggered by calendar events',
    },
  ]

  const actions: SidebarItemData[] = [
    {
      id: 'action-email',
      type: 'action',
      label: 'Send Email',
      icon: <Mail size={20} />,
      description: 'Send summary via email',
    },
    {
      id: 'action-slack',
      type: 'action',
      label: 'Send to Slack',
      icon: <Slack size={20} />,
      description: 'Post to Slack channel',
    },
    {
      id: 'action-jira',
      type: 'action',
      label: 'Create Jira Issue',
      icon: <CheckSquare size={20} />,
      description: 'Create task in Jira',
    },
    {
      id: 'action-notion',
      type: 'action',
      label: 'Save to Notion',
      icon: <Database size={20} />,
      description: 'Add to Notion database',
    },
    {
      id: 'action-webhook',
      type: 'action',
      label: 'Webhook',
      icon: <Globe size={20} />,
      description: 'Send data to webhook',
    },
  ]

  const aiMagic: SidebarItemData[] = [
    {
      id: 'ai-summary',
      type: 'ai',
      label: 'Extract Summary',
      icon: <FileText size={20} />,
      description: 'Generate concise summary',
    },
    {
      id: 'ai-tasks',
      type: 'ai',
      label: 'Extract Action Items',
      icon: <CheckSquare size={20} />,
      description: 'Identify tasks & assignees',
    },
    {
      id: 'ai-risks',
      type: 'ai',
      label: 'Extract Risks & Decisions',
      icon: <AlertTriangle size={20} />,
      description: 'Find key risks and decisions',
    },
    {
      id: 'ai-sentiment',
      type: 'ai',
      label: 'Sentiment Analysis',
      icon: <Smile size={20} />,
      description: 'Analyze tone and sentiment',
    },
    {
      id: 'ai-custom',
      type: 'ai',
      label: 'Custom AI Prompt',
      icon: <Brain size={20} />,
      description: 'Run custom prompt',
    },
  ]

  const logic: SidebarItemData[] = [
    {
      id: 'logic-branch',
      type: 'branch',
      label: 'Condition (If/Else)',
      icon: <GitFork size={20} />,
      description: 'Branch workflow based on conditions',
    },
  ]

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    // Find the item in inputSources, actions, or aiMagic
    const item = [...inputSources, ...actions, ...aiMagic, ...logic].find((i) => i.id === active.id)
    if (item) {
      setActiveItem(item)
    }
  }

  // Helper to clean up errors that are resolved
  const validateAndCleanErrors = (currentNodes: WorkflowItemData[]) => {
    // If no errors exist, we don't need to do anything (we don't want to show NEW errors while editing)
    if (Object.keys(validationErrors).length === 0) return

    const newErrors = validationService.validateWorkflow(currentNodes as any)
    const nextErrors: Record<string, string> = {}

    // Only keep errors that still exist in the new validation result
    // This ensures we clear fixed errors but don't annoy users with new errors while they are typing/dragging
    Object.keys(validationErrors).forEach((nodeId) => {
      if (newErrors[nodeId]) {
        nextErrors[nodeId] = newErrors[nodeId]
      }
    })

    // Only update if the error count changed or messages changed
    if (JSON.stringify(nextErrors) !== JSON.stringify(validationErrors)) {
      setValidationErrors(nextErrors)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over) {
      const item = [...inputSources, ...actions, ...aiMagic, ...logic].find((i) => i.id === active.id)

      if (item) {
        const newNode: WorkflowItemData = {
          ...item,
          instanceId: `${item.id}-${crypto.randomUUID()}`, // Unique ID
          branches: item.type === 'branch' ? { true: [], false: [] } : undefined,
        }

        // Recursive function to add node to the correct list
        const addNodeToList = (currentNodes: WorkflowItemData[], targetListId: string): WorkflowItemData[] => {
          // If this is the root list
          if (targetListId === 'canvas') {
            // Changed from 'root' to 'canvas' to match DroppableCanvas ID
            return [...currentNodes, newNode]
          }

          return currentNodes.map((node) => {
            if (node.branches) {
              // Check if target is one of this node's branches
              if (targetListId === `${node.instanceId}-true`) {
                return {
                  ...node,
                  branches: {
                    ...node.branches,
                    true: [...node.branches.true, newNode],
                  },
                }
              }
              if (targetListId === `${node.instanceId}-false`) {
                return {
                  ...node,
                  branches: {
                    ...node.branches,
                    false: [...node.branches.false, newNode],
                  },
                }
              }

              // Recurse deeper
              return {
                ...node,
                branches: {
                  true: addNodeToList(node.branches.true, targetListId),
                  false: addNodeToList(node.branches.false, targetListId),
                },
              }
            }
            return node
          })
        }

        const targetId = over.id as string
        let nextNodes: WorkflowItemData[] = []

        if (targetId === 'canvas') {
          nextNodes = [...nodes, newNode]
        } else {
          nextNodes = addNodeToList(nodes, targetId)
        }

        setNodes(nextNodes)
        validateAndCleanErrors(nextNodes)
      }
    }

    setActiveItem(null)
  }

  // Recursive delete
  const deleteNodeRecursive = (currentNodes: WorkflowItemData[], targetId: string): WorkflowItemData[] => {
    return currentNodes
      .filter((node) => node.instanceId !== targetId)
      .map((node) => {
        if (node.branches) {
          return {
            ...node,
            branches: {
              true: deleteNodeRecursive(node.branches.true, targetId),
              false: deleteNodeRecursive(node.branches.false, targetId),
            },
          }
        }
        return node
      })
  }

  const handleDeleteNode = (instanceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const nextNodes = deleteNodeRecursive(nodes, instanceId)
    setNodes(nextNodes)

    if (selectedNodeId === instanceId) {
      setSelectedNodeId(null)
    }

    // We still want to remove the specific error for the deleted node immediately
    // But we also want to check if this deletion fixed/caused other errors (handled by validateAndCleanErrors)
    // However, validateAndCleanErrors only keeps existing errors.
    // So if we delete a node, its error key is still in validationErrors, but won't be in newErrors (node gone).
    // So validateAndCleanErrors will remove it. Perfect.
    validateAndCleanErrors(nextNodes)
  }

  const handleConfigClick = (instanceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNodeId(instanceId)
  }

  const handleCanvasClick = () => {
    setSelectedNodeId(null)
  }

  // Recursive update
  const updateNodeRecursive = (currentNodes: WorkflowItemData[], targetId: string, data: any): WorkflowItemData[] => {
    return currentNodes.map((node) => {
      if (node.instanceId === targetId) {
        return { ...node, ...data }
      }
      if (node.branches) {
        return {
          ...node,
          branches: {
            true: updateNodeRecursive(node.branches.true, targetId, data),
            false: updateNodeRecursive(node.branches.false, targetId, data),
          },
        }
      }
      return node
    })
  }

  const handleUpdateNode = (nodeId: string, data: any) => {
    const nextNodes = updateNodeRecursive(nodes, nodeId, data)
    setNodes(nextNodes)
    validateAndCleanErrors(nextNodes)
  }

  const handleSave = () => {
    // Validate
    const errors = validationService.validateWorkflow(nodes as any)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      showToast(`Cannot save: ${Object.keys(errors).length} errors found. Please check the red nodes.`, 'error')
      return
    }

    const id = workflowId || crypto.randomUUID()

    // Recursive function to strip icons
    const stripIcons = (nodes: WorkflowItemData[]): any[] => {
      return nodes.map(({ icon, branches, ...rest }) => {
        const node: any = { ...rest }
        if (branches) {
          node.branches = {
            true: stripIcons(branches.true),
            false: stripIcons(branches.false),
          }
        }
        return node
      })
    }

    const serializableNodes = stripIcons(nodes)

    const workflow: Workflow = {
      id,
      name: workflowName,
      nodes: serializableNodes as any,
      isEnabled,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    workflowService.saveWorkflow(workflow)

    if (!workflowId) {
      setSearchParams({ id })
    }

    showToast('Workflow saved successfully!', 'success')
  }

  // Recursive find
  const findNodeRecursive = (currentNodes: WorkflowItemData[], targetId: string): WorkflowItemData | null => {
    for (const node of currentNodes) {
      if (node.instanceId === targetId) return node
      if (node.branches) {
        const foundInTrue = findNodeRecursive(node.branches.true, targetId)
        if (foundInTrue) return foundInTrue
        const foundInFalse = findNodeRecursive(node.branches.false, targetId)
        if (foundInFalse) return foundInFalse
      }
    }
    return null
  }

  const selectedNode = selectedNodeId ? findNodeRecursive(nodes, selectedNodeId) : null

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen overflow-hidden">
        {/* Left Panel - Building Blocks */}
        <aside className="w-[40%] bg-white border-r border-gray-200 flex flex-col h-full">
          {/* Fixed Header */}
          <div className="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <button
              onClick={() => navigate('/automation')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Automation Studio</span>
            </button>
            <h2 className="text-gray-900 text-2xl font-bold">Building Blocks</h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-4 flex flex-col gap-8">
            <div className="flex flex-col gap-6 pb-20">
              {/* Input Sources Section */}
              <section className="flex flex-col gap-4">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider px-2">Input Sources</h3>
                <div className="grid grid-cols-2 gap-4">
                  {inputSources.map((source) => (
                    <DraggableSidebarItem key={source.id} item={source} />
                  ))}
                </div>
              </section>

              {/* Logic Section */}
              <section className="flex flex-col gap-4">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider px-2">Logic</h3>
                <div className="grid grid-cols-2 gap-4">
                  {logic.map((item) => (
                    <DraggableSidebarItem key={item.id} item={item} />
                  ))}
                </div>
              </section>

              {/* AI Magic Section */}
              <section className="flex flex-col gap-4">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider px-2">AI Magic</h3>
                <div className="grid grid-cols-2 gap-4">
                  {aiMagic.map((item) => (
                    <DraggableSidebarItem key={item.id} item={item} />
                  ))}
                </div>
              </section>

              {/* Actions Section */}
              <section className="flex flex-col gap-4">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider px-2">Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {actions.map((action) => (
                    <DraggableSidebarItem key={action.id} item={action} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </aside>

        {/* Right Panel - Workflow Canvas */}
        <div className="w-[60%] flex flex-col h-full relative">
          {/* Fixed Header */}
          <header className="flex justify-between items-center p-8 pb-6 border-b border-gray-200 bg-white z-10 flex-shrink-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 group">
                {isEditingName ? (
                  <input
                    autoFocus
                    className="text-gray-900 text-2xl font-bold bg-transparent p-1 -m-1 rounded-md border border-primary focus:ring-2 focus:ring-primary focus:outline-none min-w-[200px]"
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingName(false)
                      if (e.key === 'Escape') setIsEditingName(false)
                    }}
                  />
                ) : (
                  <>
                    <h1 className="text-gray-900 text-2xl font-bold">{workflowName}</h1>
                    <Edit2
                      size={16}
                      className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => setIsEditingName(true)}
                    />
                  </>
                )}
              </div>
              <p className="text-gray-500 text-sm">
                {workflowId ? 'Saved' : 'Unsaved Draft'} • {countWorkflowNodes(nodes)} nodes
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Toggle checked={isEnabled} onChange={setIsEnabled} leftLabel="Disable" rightLabel="Enable" />
              <Button variant="secondary" size="md">
                Test Flow
              </Button>
              <Button variant="primary" size="md" onClick={handleSave}>
                Save
              </Button>
            </div>
          </header>

          {/* Scrollable Canvas */}
          <div className="flex-1 overflow-y-auto p-8 relative" onClick={handleCanvasClick}>
            <WorkflowList
              items={nodes}
              listId="canvas"
              selectedNodeId={selectedNodeId}
              errors={validationErrors}
              onConfigClick={handleConfigClick}
              onDeleteClick={handleDeleteNode}
            />
          </div>

          {/* Configuration Panel */}
          <NodeConfigPanel
            selectedNode={selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onUpdate={handleUpdateNode}
          />
        </div>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-white shadow-xl w-[200px] opacity-90">
            <span className="text-primary">{activeItem.icon}</span>
            <span className="text-gray-800 text-sm font-medium">{activeItem.label}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default WorkflowBuilder
