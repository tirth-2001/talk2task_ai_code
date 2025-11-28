import React from 'react'
import { useNavigate } from 'react-router-dom'

import clsx from 'clsx'
import { AlertTriangle, CheckCircle, Clock, Flag } from 'lucide-react'

interface Task {
  id: number
  title: string
  owner: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'done'
}

const TaskTable: React.FC = () => {
  const navigate = useNavigate()

  const tasks: Task[] = [
    {
      id: 1,
      title: 'Draft Q4 marketing report',
      owner: 'John Doe',
      dueDate: 'Oct 26, 2023',
      priority: 'high',
      status: 'in_progress',
    },
    {
      id: 2,
      title: 'Schedule follow-up meeting with the design team',
      owner: 'Sarah Smith',
      dueDate: 'Nov 02, 2023',
      priority: 'medium',
      status: 'todo',
    },
    {
      id: 3,
      title: 'Finalize the budget allocation for the new project',
      owner: 'Mark Johnson',
      dueDate: 'Oct 24, 2023',
      priority: 'high',
      status: 'done',
    },
    {
      id: 4,
      title: 'Review and approve the latest press release',
      owner: 'Emily Chen',
      dueDate: 'Oct 28, 2023',
      priority: 'low',
      status: 'todo',
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-700 bg-red-100'
      case 'medium':
        return 'text-orange-700 bg-orange-100'
      case 'low':
        return 'text-yellow-700 bg-yellow-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'text-green-700 bg-green-100'
      case 'in_progress':
        return 'text-blue-700 bg-blue-100'
      case 'todo':
        return 'text-gray-700 bg-gray-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return CheckCircle
      case 'in_progress':
        return Clock
      case 'todo':
        return AlertTriangle
      default:
        return Clock
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Action Items</h1>
            <p className="text-base text-gray-500">AI-generated tasks from your meeting summary.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/slack')}
              className="flex items-center justify-center px-4 h-10 bg-transparent text-gray-700 text-sm font-medium rounded-lg gap-2 border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <span>Send Slack Reminders</span>
            </button>
            <button className="flex items-center justify-center px-4 h-10 bg-primary text-white text-sm font-medium rounded-lg gap-2 hover:bg-primary/90 transition-colors">
              <span>Export to Jira</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Task Summary</th>
                <th className="px-4 py-3 text-left w-48 text-gray-600 text-sm font-medium">Owner</th>
                <th className="px-4 py-3 text-left w-40 text-gray-600 text-sm font-medium">Due Date</th>
                <th className="px-4 py-3 text-left w-32 text-gray-600 text-sm font-medium">Priority</th>
                <th className="px-4 py-3 text-left w-40 text-gray-600 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status)
                return (
                  <tr key={task.id} className="hover:bg-gray-50 group transition-colors">
                    <td className="px-4 py-4 text-gray-800 text-sm font-medium">{task.title}</td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                          {task.owner
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="text-gray-800">{task.owner}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{task.dueDate}</td>
                    <td className="px-4 py-4 text-sm">
                      <div
                        className={clsx(
                          'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                          getPriorityColor(task.priority),
                        )}
                      >
                        <Flag size={14} />
                        <span className="capitalize">{task.priority}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div
                        className={clsx(
                          'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                          getStatusColor(task.status),
                        )}
                      >
                        <StatusIcon size={14} />
                        <span className="capitalize">{task.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500">These tasks were generated automatically from your meeting summary.</p>
      </div>
    </div>
  )
}

export default TaskTable
