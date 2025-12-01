import type { WorkflowNodeData } from './workflowService'

export interface ValidationError {
  nodeId: string
  message: string
}

export const validationService = {
  validateWorkflow: (nodes: WorkflowNodeData[]): Record<string, string> => {
    const errors: Record<string, string> = {}

    const validateNode = (node: WorkflowNodeData) => {
      // 1. Check for required configuration based on node type
      if (node.type === 'action' || node.type === 'ai') {
        // For now, we'll just check if config exists and has at least one key
        // In a real app, we'd have specific schemas for each node type
        if (!node.config || Object.keys(node.config).length === 0) {
          errors[node.instanceId] = 'Configuration required'
        }
      }

      // 2. Check for empty branches
      if (node.type === 'branch' && node.branches) {
        if (node.branches.true.length === 0 && node.branches.false.length === 0) {
          errors[node.instanceId] = 'At least one branch path must have steps'
        }

        // Recursively validate branches
        node.branches.true.forEach(validateNode)
        node.branches.false.forEach(validateNode)
      }
    }

    nodes.forEach(validateNode)
    return errors
  },
}
