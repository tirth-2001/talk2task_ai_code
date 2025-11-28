import React from 'react'

import { ArrowRight, Brain, Calendar, Mail, MessageSquare, Plus } from 'lucide-react'

const FollowUpSuggestions: React.FC = () => {
  const suggestions = [
    {
      icon: Calendar,
      title: 'Schedule Q4 Review Meeting',
      description: 'Based on the action items, schedule a follow-up meeting in 2 weeks to review progress.',
      priority: 'high',
      automated: true,
    },
    {
      icon: Mail,
      title: 'Send Summary Email',
      description: 'Email meeting summary and action items to all participants and stakeholders.',
      priority: 'medium',
      automated: false,
    },
    {
      icon: MessageSquare,
      title: 'Create Slack Channel',
      description: 'Set up a dedicated Slack channel for Q4 planning discussions and updates.',
      priority: 'low',
      automated: true,
    },
    {
      icon: Plus,
      title: 'Add to Project Board',
      description: 'Create cards in your project management tool for each high-priority action item.',
      priority: 'medium',
      automated: false,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'low':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Brain className="text-primary" size={28} />
              <h1 className="text-3xl font-black tracking-tight text-gray-900">AI Suggestions</h1>
            </div>
            <p className="text-base text-gray-500">Recommended follow-up actions based on your meeting</p>
          </div>
          <button className="flex items-center justify-center px-4 h-10 bg-primary text-white text-sm font-medium rounded-lg gap-2 hover:bg-primary/90 transition-colors">
            <span>Execute All Automated</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{suggestion.title}</h3>
                      {suggestion.automated && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <Brain size={12} />
                          Auto
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(suggestion.priority)}`}
                      >
                        {suggestion.priority.toUpperCase()} PRIORITY
                      </span>
                      <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        Execute
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Brain className="text-blue-600 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">AI-Powered Automation</h4>
            <p className="text-sm text-blue-700">
              These suggestions are generated based on your meeting content, past patterns, and team workflows. Actions
              marked with "Auto" can be executed automatically with one click.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FollowUpSuggestions
