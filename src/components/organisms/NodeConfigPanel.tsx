import React, { useState } from 'react'
import { X, Settings, Sliders, Code } from 'lucide-react'
import { Button, Input, Textarea, TabButton, Select } from '@/components'

interface NodeConfigPanelProps {
  selectedNode: {
    id: string
    type: string
    label: string
    icon: React.ReactNode
    description?: string
    config?: Record<string, any>
    instanceId: string
  } | null
  onClose: () => void
  onUpdate: (nodeId: string, data: any) => void
}

// Generic Field Schema
interface FieldSchema {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number'
  placeholder?: string
  options?: string[]
  description?: string
}

// Configuration Schemas for different node types
const NODE_CONFIG_SCHEMAS: Record<string, FieldSchema[]> = {
  'action-email': [
    { key: 'recipient', label: 'Recipient', type: 'text', placeholder: 'e.g., team@company.com' },
    { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Enter email subject' },
    { key: 'body', label: 'Email Body', type: 'textarea', placeholder: 'Enter email content...' },
  ],
  'action-slack': [
    { key: 'channel', label: 'Slack Channel', type: 'text', placeholder: '#general' },
    { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter message...' },
  ],
  'ai-summary': [
    { key: 'model', label: 'AI Model', type: 'select', options: ['GPT-4', 'Claude 3.5 Sonnet', 'Gemini Pro'] },
    { key: 'length', label: 'Summary Length', type: 'select', options: ['Short', 'Medium', 'Long'] },
    { key: 'focus', label: 'Focus Area', type: 'text', placeholder: 'e.g., Decisions, Action Items' },
  ],
  'ai-tasks': [
    { key: 'model', label: 'AI Model', type: 'select', options: ['GPT-4', 'Claude 3.5 Sonnet', 'Gemini Pro'] },
    { key: 'assignee', label: 'Default Assignee', type: 'text', placeholder: 'e.g., Project Manager' },
  ],
  // Fallback for generic types
  'action': [
    { key: 'actionType', label: 'Action Type', type: 'select', options: ['Immediate', 'Scheduled', 'Recurring'] },
  ],
  'aiMagic': [
    { key: 'model', label: 'AI Model', type: 'select', options: ['GPT-4', 'Claude 3.5 Sonnet', 'Gemini Pro'] },
    { key: 'prompt', label: 'Custom Prompt', type: 'textarea', placeholder: 'Enter your custom prompt...' },
  ],
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ selectedNode, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('general')

  if (!selectedNode) return null

  // Get schema based on specific ID first, then fallback to general type
  const configFields = NODE_CONFIG_SCHEMAS[selectedNode.id] || NODE_CONFIG_SCHEMAS[selectedNode.type] || []

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...(selectedNode.config || {}), [key]: value }
    onUpdate(selectedNode.instanceId, { config: newConfig })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-1/2 h-full bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="text-primary p-2 bg-primary/10 rounded-lg">{selectedNode.icon}</div>
            <div>
              <h3 className="font-bold text-gray-900">{selectedNode.label}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedNode.type}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 gap-8">
          <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
            <div className="flex items-center gap-2">
              <Settings size={14} />
              <span>General</span>
            </div>
          </TabButton>
          <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')}>
            <div className="flex items-center gap-2">
              <Sliders size={14} />
              <span>Config</span>
            </div>
          </TabButton>
          <TabButton active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')}>
            <div className="flex items-center gap-2">
              <Code size={14} />
              <span>Advanced</span>
            </div>
          </TabButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'general' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Node Label</label>
                <Input
                  placeholder="Enter node label"
                  value={selectedNode.label}
                  fullWidth
                  onChange={(e) => onUpdate(selectedNode.instanceId, { label: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  placeholder="Enter description"
                  value={selectedNode.description || ''}
                  fullWidth
                  minHeight="min-h-24"
                  onChange={(e) => onUpdate(selectedNode.instanceId, { description: e.target.value })}
                />
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="flex flex-col gap-6">
              {configFields.length > 0 ? (
                configFields.map((field) => (
                  <div key={field.key} className="flex flex-col gap-2">
                    {field.type === 'textarea' ? (
                      <>
                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                        <Textarea
                          placeholder={field.placeholder}
                          value={selectedNode.config?.[field.key] || ''}
                          fullWidth
                          onChange={(e) => handleConfigChange(field.key, e.target.value)}
                        />
                      </>
                    ) : field.type === 'select' ? (
                      <Select
                        label={field.label}
                        options={field.options || []}
                        value={selectedNode.config?.[field.key] || ''}
                        fullWidth
                        onChange={(e) => handleConfigChange(field.key, e.target.value)}
                      />
                    ) : (
                      <>
                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={selectedNode.config?.[field.key] || ''}
                          fullWidth
                          onChange={(e) => handleConfigChange(field.key, e.target.value)}
                        />
                      </>
                    )}
                    {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
                  </div>
                ))
              ) : (
                <div className="p-4 bg-gray-50 text-gray-500 rounded-lg text-sm border border-gray-200 text-center">
                  No configuration options available for this node type.
                </div>
              )}
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Node ID (Unique)</label>
                <div className="flex items-center gap-2">
                  <Input value={selectedNode.instanceId} fullWidth disabled className="bg-gray-50 text-gray-500 font-mono text-xs" />
                </div>
                <p className="text-xs text-gray-400">Auto-generated unique identifier for this node instance.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Timeout (ms)</label>
                <Input type="number" placeholder="5000" fullWidth />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Retry Policy</label>
                <Select
                  options={['None', 'Retry 3 times', 'Exponential Backoff']}
                  fullWidth
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="primary" fullWidth onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NodeConfigPanel
