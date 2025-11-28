export interface WorkflowNodeData {
  id: string
  type: string
  label: string
  icon?: any // We'll need to handle icon serialization carefully or reconstruct it
  description?: string
  config?: Record<string, any>
  instanceId: string
}

export interface Workflow {
  id: string
  name: string
  nodes: WorkflowNodeData[]
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'talk2task_workflows'

export const workflowService = {
  getAllWorkflows: (): Workflow[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading workflows:', error)
      return []
    }
  },

  getWorkflow: (id: string): Workflow | undefined => {
    const workflows = workflowService.getAllWorkflows()
    return workflows.find((w) => w.id === id)
  },

  saveWorkflow: (workflow: Workflow): void => {
    const workflows = workflowService.getAllWorkflows()
    const index = workflows.findIndex((w) => w.id === workflow.id)

    if (index >= 0) {
      workflows[index] = { ...workflow, updatedAt: new Date().toISOString() }
    } else {
      workflows.push({ ...workflow, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows))
  },

  deleteWorkflow: (id: string): void => {
    const workflows = workflowService.getAllWorkflows()
    const filtered = workflows.filter((w) => w.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },
}
