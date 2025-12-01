import { type WorkflowNodeData } from '@/services/workflowService'

/**
 * Recursively count all nodes in a workflow, including nested branch nodes
 */
export const countWorkflowNodes = (nodes: WorkflowNodeData[]): number => {
  let count = 0
  
  for (const node of nodes) {
    count += 1 // Count the current node
    
    // If this node has branches, recursively count nodes in each branch
    if (node.branches) {
      count += countWorkflowNodes(node.branches.true)
      count += countWorkflowNodes(node.branches.false)
    }
  }
  
  return count
}
