import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  Calendar,
  FileText,
  MessageSquare,
  Mail,
  CalendarDays,
  Send,
  Bell,
  ArrowDown,
  ArrowLeft,
  CheckSquare,
  AlertTriangle,
  Smile,
  Brain,
  Slack,
  Database,
  Globe,
  Zap,
} from 'lucide-react'
import { Button, Toggle, WorkflowNode, NodeConfigPanel } from '@/components'
import { type Workflow, workflowService } from '@/services/workflowService'

// Types
interface SidebarItemData {
  id: string
  type: 'trigger' | 'action' | 'ai' | 'source'
  label: string
  icon: React.ReactNode
  description?: string
}

interface WorkflowItemData extends SidebarItemData {
  instanceId: string
  config?: Record<string, any>
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

// Droppable Canvas Component
const DroppableCanvas: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  })

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`flex-grow flex justify-center pt-12 min-h-[500px] transition-colors rounded-xl ${
        isOver ? 'bg-primary/5 border-2 border-dashed border-primary/30' : ''
      }`}
    >
      {children}
    </div>
  )
}

const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const workflowId = searchParams.get('id')

  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [isEnabled, setIsEnabled] = useState(true)
  const [nodes, setNodes] = useState<WorkflowItemData[]>([])
  const [activeItem, setActiveItem] = useState<SidebarItemData | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Load workflow on mount
  useEffect(() => {
    if (workflowId) {
      const savedWorkflow = workflowService.getWorkflow(workflowId)
      if (savedWorkflow) {
        setWorkflowName(savedWorkflow.name)
        setIsEnabled(savedWorkflow.isEnabled)
        // Reconstruct icons for nodes since they are not serializable
        const reconstructedNodes = savedWorkflow.nodes.map(node => {
          const originalItem = [...inputSources, ...aiMagic, ...actions].find(i => i.id === node.id)
          return {
            ...node,
            icon: originalItem ? originalItem.icon : <Zap size={20} /> // Fallback icon
          }
        })
        setNodes(reconstructedNodes as WorkflowItemData[])
      }
    }
  }, [workflowId])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
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
    { id: 'action-email', type: 'action', label: 'Send Email', icon: <Mail size={20} />, description: 'Send summary via email' },
    { id: 'action-slack', type: 'action', label: 'Send to Slack', icon: <Slack size={20} />, description: 'Post to Slack channel' },
    { id: 'action-jira', type: 'action', label: 'Create Jira Issue', icon: <CheckSquare size={20} />, description: 'Create task in Jira' },
    { id: 'action-notion', type: 'action', label: 'Save to Notion', icon: <Database size={20} />, description: 'Add to Notion database' },
    { id: 'action-webhook', type: 'action', label: 'Webhook', icon: <Globe size={20} />, description: 'Send data to webhook' },
  ]

  const aiMagic: SidebarItemData[] = [
    { id: 'ai-summary', type: 'ai', label: 'Extract Summary', icon: <FileText size={20} />, description: 'Generate concise summary' },
    { id: 'ai-tasks', type: 'ai', label: 'Extract Action Items', icon: <CheckSquare size={20} />, description: 'Identify tasks & assignees' },
    { id: 'ai-risks', type: 'ai', label: 'Extract Risks & Decisions', icon: <AlertTriangle size={20} />, description: 'Find key risks and decisions' },
    { id: 'ai-sentiment', type: 'ai', label: 'Sentiment Analysis', icon: <Smile size={20} />, description: 'Analyze tone and sentiment' },
    { id: 'ai-custom', type: 'ai', label: 'Custom AI Prompt', icon: <Brain size={20} />, description: 'Run custom prompt' },
  ]

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    
    // Find the item in inputSources, actions, or aiMagic
    const item = [...inputSources, ...actions, ...aiMagic].find(i => i.id === active.id)
    if (item) {
      setActiveItem(item)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === 'canvas') {
      const item = [...inputSources, ...actions, ...aiMagic].find(i => i.id === active.id)
      if (item) {
        const newNode: WorkflowItemData = {
          ...item,
          instanceId: `${item.id}-${crypto.randomUUID()}`, // Unique ID
        }
        setNodes((prev) => [...prev, newNode])
        // Removed setSelectedNodeId(newNode.instanceId) to prevent auto-open
      }
    }

    setActiveItem(null)
  }

  const handleDeleteNode = (instanceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNodes((prev) => prev.filter((node) => node.instanceId !== instanceId))
    if (selectedNodeId === instanceId) {
      setSelectedNodeId(null)
    }
  }

  const handleConfigClick = (instanceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNodeId(instanceId)
  }

  const handleCanvasClick = () => {
    setSelectedNodeId(null)
  }

  const handleUpdateNode = (nodeId: string, data: any) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.instanceId === nodeId) {
          return { ...node, ...data }
        }
        return node
      })
    )
  }

  const handleSave = () => {
    const id = workflowId || crypto.randomUUID()
    
    // Create serializable nodes (remove icon component)
    const serializableNodes = nodes.map(({ icon, ...rest }) => rest)

    const workflow: Workflow = {
      id,
      name: workflowName,
      nodes: serializableNodes as any, // Cast to any to bypass icon type check for storage
      isEnabled,
      createdAt: new Date().toISOString(), // Will be overwritten by service if exists
      updatedAt: new Date().toISOString(),
    }

    workflowService.saveWorkflow(workflow)
    
    // Update URL if it's a new workflow
    if (!workflowId) {
      setSearchParams({ id })
    }

    // Optional: Show toast notification here
    alert('Workflow saved successfully!')
  }

  const selectedNode = nodes.find((n) => n.instanceId === selectedNodeId) || null

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
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Input Sources</h3>
                <div className="grid grid-cols-2 gap-4">
                  {inputSources.map((source) => (
                    <DraggableSidebarItem key={source.id} item={source} />
                  ))}
                </div>
              </section>

              {/* AI Magic Section */}
              <section className="flex flex-col gap-4">
                <h3 className="text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Brain size={16} />
                  AI Magic
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {aiMagic.map((item) => (
                    <DraggableSidebarItem key={item.id} item={item} />
                  ))}
                </div>
              </section>

              {/* Actions Section */}
              <section className="flex flex-col gap-4">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Actions</h3>
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
              <input
                className="text-gray-900 text-2xl font-bold bg-transparent p-1 -m-1 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
              <p className="text-gray-500 text-sm">
                {workflowId ? 'Saved' : 'Unsaved Draft'} • {nodes.length} nodes
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
          <div className="flex-1 overflow-y-auto p-8 relative">
            <DroppableCanvas onClick={handleCanvasClick}>
              <div className="flex flex-col items-center gap-4 w-full max-w-sm pb-32">
                {nodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl w-full">
                    <p>Drag and drop items here to build your workflow</p>
                  </div>
                ) : (
                  nodes.map((node, index) => (
                    <React.Fragment key={node.instanceId}>
                      <div className="relative group w-full">
                        <WorkflowNode
                          icon={node.icon}
                          title={node.label}
                          description={node.description || ''}
                          isSelected={selectedNodeId === node.instanceId}
                          onConfigClick={(e) => handleConfigClick(node.instanceId, e)}
                          onDeleteClick={(e) => handleDeleteNode(node.instanceId, e)}
                        />
                      </div>
                      {index < nodes.length - 1 && (
                        <div className="text-primary">
                          <ArrowDown size={32} />
                        </div>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </DroppableCanvas>
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
