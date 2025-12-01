import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { GitBranch, Plus, Save, Settings, Zap, Trash2, Brain, Clock, FileInput } from 'lucide-react'
import { Button, Badge, Card, PageHeader, SectionHeader, IconContainer } from '@/components'
import { workflowService, type Workflow } from '@/services/workflowService'
import { countWorkflowNodes } from '@/utils/workflowUtils'

const AutomationStudio: React.FC = () => {
  const navigate = useNavigate()
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  useEffect(() => {
    setWorkflows(workflowService.getAllWorkflows().reverse())
  }, [])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this workflow?')) {
      workflowService.deleteWorkflow(id)
      setWorkflows(workflowService.getAllWorkflows())
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <PageHeader
          title="Automation Studio"
          description="Create and manage automated workflows for your meetings"
          action={
            <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => navigate('/workflow-builder')}>
              Create New Workflow
            </Button>
          }
        />

        {/* Workflows List */}
        <div className="flex flex-col gap-4">
          {workflows.length > 0 && (
            <SectionHeader title="Your Workflows" className="mb-2" />
          )}
          
          {workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 bg-gray-50">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <GitBranch size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No workflows yet</h3>
              <p className="text-gray-500 mb-6 max-w-md text-center">
                Create your first workflow to automate tasks, summaries, and more from your meetings.
              </p>
            </div>
          ) : (
            workflows.map((workflow) => {
              const totalNodes = countWorkflowNodes(workflow.nodes)
              const inputCount = workflow.nodes.filter(n => n.type === 'trigger' || n.type === 'source').length
              const aiCount = workflow.nodes.filter(n => n.type === 'ai').length
              const actionCount = workflow.nodes.filter(n => n.type === 'action').length
              
              return (
                <Card 
                  key={workflow.id} 
                  hover 
                  className="cursor-pointer"
                  onClick={() => navigate(`/workflow-builder?id=${workflow.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-primary">{workflow.name}</h3>
                        <Badge variant={workflow.isEnabled ? 'success' : 'neutral'} dot>
                          {workflow.isEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex items-center my-2 mb-3 gap-2">
                        <GitBranch size={14} />
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {workflow.nodes.length > 0 
                          ? `Workflow with ${totalNodes} nodes` 
                          : 'Empty workflow'}
                      </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <FileInput size={14} />
                          <span>{inputCount} inputs</span>
                        </div>
                        {aiCount > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Brain size={14} />
                            <span>{aiCount} AI steps</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Zap size={14} />
                          <span>{actionCount} actions</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>Last updated: {new Date(workflow.updatedAt).toLocaleString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Trash2 size={18} />} 
                        onClick={(e) => handleDelete(workflow.id, e)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      />
                      <Button variant="ghost" size="sm" icon={<Settings size={18} />}
                      className="text-gray-400 hover:text-primary hover:bg-primary/10"
                      />
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Workflow Builder Placeholder */}
        <div className="bg-gradient-to-br from-primary/5 to-purple-50 rounded-xl border-2 border-dashed border-primary/30 p-12">
          <div className="flex flex-col items-center text-center gap-4 max-w-md mx-auto">
            <IconContainer size="xl" variant="primary">
              <GitBranch size={32} />
            </IconContainer>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visual Workflow Builder</h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop nodes to create custom automation workflows. Connect triggers, conditions, and actions to
                build powerful automations.
              </p>
            </div>
            <Button variant="primary" size="lg" icon={<Plus size={16} />} onClick={() => navigate('/workflow-builder')}>
              Open Workflow Builder
            </Button>
          </div>
        </div>

        {/* Templates */}
        <div>
          <SectionHeader title="Workflow Templates" className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Task Assignment', icon: '👥', description: 'Auto-assign tasks to team members' },
              { name: 'Notification Hub', icon: '🔔', description: 'Send alerts across platforms' },
              { name: 'Integration Sync', icon: '🔄', description: 'Sync with external tools' },
            ].map((template, index) => (
              <Card key={index} hover padding="md">
                <div className="text-3xl mb-2">{template.icon}</div>
                <h4 className="font-bold text-gray-900 mb-1">{template.name}</h4>
                <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                <button className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
                  Use Template
                  <Save size={12} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AutomationStudio
