import React, { useState } from 'react'

import { Bell, Check, Send, Slack, Clock } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import clsx from 'clsx'

const SlackReminder: React.FC = () => {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([1, 2])
  const { showToast } = useToast()
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const handleFakeAction = (actionName: string, message: string) => {
    setLoadingAction(actionName)
    setTimeout(() => {
      setLoadingAction(null)
      showToast(message, 'success')
    }, 1500)
  }

  const tasks = [
    { id: 1, title: 'Draft Q4 marketing report', owner: 'John Doe', dueDate: 'Oct 26, 2023' },
    { id: 2, title: 'Schedule follow-up meeting', owner: 'Sarah Smith', dueDate: 'Nov 02, 2023' },
    { id: 3, title: 'Finalize budget allocation', owner: 'Mark Johnson', dueDate: 'Oct 24, 2023' },
  ]

  const toggleTask = (id: number) => {
    setSelectedTasks((prev) => (prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]))
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Slack Reminders</h1>
          <p className="text-base text-gray-500">Send task reminders to your team via Slack</p>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="p-3 rounded-lg bg-purple-100">
              <Slack className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Reminder Preview</h2>
              <p className="text-sm text-gray-500">This is how your message will appear in Slack</p>
            </div>
          </div>

          {/* Slack Message Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border-l-4 border-primary">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white text-sm font-bold">
                T2T
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">Talk2Task AI</span>
                  <span className="text-xs text-gray-500">BOT</span>
                  <span className="text-xs text-gray-500">• Just now</span>
                </div>
                <div className="text-sm text-gray-700">
                  <p className="mb-3">👋 Hi team! Here are your pending action items from the latest meeting:</p>
                  <div className="space-y-2">
                    {tasks
                      .filter((task) => selectedTasks.includes(task.id))
                      .map((task) => (
                        <div key={task.id} className="bg-white rounded p-3 border border-gray-200">
                          <p className="font-medium text-gray-900 mb-1">✅ {task.title}</p>
                          <p className="text-xs text-gray-600">
                            👤 {task.owner} • 📅 Due: {task.dueDate}
                          </p>
                        </div>
                      ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-600">
                    Need to update a task? Visit the{' '}
                    <span className="text-primary font-medium">Talk2Task dashboard</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Task Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Tasks to Include</h3>
            <div className="space-y-2">
              {tasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary accent-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {task.owner} • {task.dueDate}
                    </p>
                  </div>
                  {selectedTasks.includes(task.id) && <Check className="text-primary" size={16} />}
                </label>
              ))}
            </div>
          </div>

          {/* Channel Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slack Channel</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
              <option>#general</option>
              <option>#product-team</option>
              <option>#engineering</option>
              <option>#marketing</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleFakeAction('schedule', 'Reminder scheduled successfully!')}
              disabled={!!loadingAction}
              className="flex-1 flex items-center justify-center px-4 h-12 bg-transparent text-gray-700 text-sm font-medium rounded-lg gap-2 border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-70 relative"
            >
              <div className={clsx("flex items-center gap-2", loadingAction === 'schedule' ? 'opacity-0' : 'opacity-100')}>
                <Bell size={16} />
                <span>Schedule for Later</span>
              </div>
              {loadingAction === 'schedule' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock size={16} className="animate-spin" />
                </div>
              )}
            </button>
            <button 
              onClick={() => handleFakeAction('send', 'Reminder sent to Slack!')}
              disabled={!!loadingAction}
              className="flex-1 flex items-center justify-center px-4 h-12 bg-primary text-white text-sm font-medium rounded-lg gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 relative"
            >
              <div className={clsx("flex items-center gap-2", loadingAction === 'send' ? 'opacity-0' : 'opacity-100')}>
                <Send size={16} />
                <span>Send Now</span>
              </div>
              {loadingAction === 'send' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock size={16} className="animate-spin" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlackReminder
