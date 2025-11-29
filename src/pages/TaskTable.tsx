import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import clsx from 'clsx'
import { AlertTriangle, CheckCircle, Clock, Flag, ArrowLeft } from 'lucide-react'
import { meetingService } from '@/services/meetingService'
import { type Task } from '@/types/meeting'
import { Button } from '@/components'

const TaskTable: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const meetingId = searchParams.get('meetingId')
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [meetingTitle, setMeetingTitle] = useState<string>('')

  useEffect(() => {
    if (meetingId) {
      const meeting = meetingService.getMeetingById(meetingId)
      if (meeting) {
        setTasks(meeting.tasks)
        setMeetingTitle(meeting.title)
      }
    }
  }, [meetingId])

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case 'done':
        return 'text-green-700 bg-green-100'
      case 'in progress':
        return 'text-blue-700 bg-blue-100'
      case 'to do':
        return 'text-gray-700 bg-gray-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return CheckCircle
      case 'in progress':
        return Clock
      case 'to do':
        return AlertTriangle
      default:
        return Clock
    }
  }

  if (!meetingId) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">No Meeting Selected</h2>
        <p className="text-gray-500 mb-6">Please select a meeting to view its tasks.</p>
        <Button variant="primary" size="md" onClick={() => navigate('/meetings')}>
          Go to Meetings
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate(`/meetings/${meetingId}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            Back to Meeting Details
          </button>
          
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-black tracking-tight text-gray-900">Action Items</h1>
              <p className="text-base text-gray-500">
                Tasks from <span className="font-semibold text-gray-900">{meetingTitle}</span>
              </p>
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
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {tasks.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No tasks found for this meeting.</p>
            </div>
          ) : (
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
                            {task.assignee
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span className="text-gray-800">{task.assignee}</span>
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
                          <span className="capitalize">{task.status}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-gray-500">These tasks were generated automatically from your meeting summary.</p>
      </div>
    </div>
  )
}

export default TaskTable
