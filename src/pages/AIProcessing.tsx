import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Brain, CheckCircle, FileText, Users } from 'lucide-react'

const AIProcessing: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate AI processing for 3 seconds
    const timer = setTimeout(() => {
      navigate('/tasks')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  const steps = [
    { icon: FileText, label: 'Analyzing content', status: 'complete' },
    { icon: Users, label: 'Identifying owners', status: 'active' },
    { icon: CheckCircle, label: 'Extracting tasks', status: 'pending' },
    { icon: Brain, label: 'Generating insights', status: 'pending' },
  ]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        {/* Animated Logo/Spinner */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Brain className="text-primary" size={48} />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>

        {/* Main Heading */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Processing Your Meeting</h1>
          <p className="text-base text-gray-500">
            Our AI is analyzing the content and extracting actionable insights...
          </p>
        </div>

        {/* Processing Steps */}
        <div className="w-full max-w-md flex flex-col gap-4 mt-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div
                  className={`p-2 rounded-lg ${
                    step.status === 'complete'
                      ? 'bg-green-100 text-green-600'
                      : step.status === 'active'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`text-sm font-medium ${
                    step.status === 'complete'
                      ? 'text-green-600'
                      : step.status === 'active'
                        ? 'text-primary'
                        : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                {step.status === 'active' && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {step.status === 'complete' && (
                  <div className="ml-auto">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIProcessing
