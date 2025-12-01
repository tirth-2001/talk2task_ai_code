import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Brain, CheckCircle, FileText, Users } from 'lucide-react'

import { meetingService } from '@/services/meetingService'
import { MeetingStatus, type Task, type Risk, type Decision } from '@/types/meeting'

const AIProcessing: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const meetingId = searchParams.get('meetingId')
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!meetingId) {
      navigate('/input-selection')
      return
    }

    const processSteps = async () => {
      // Step 1: Analyzing content
      setCurrentStep(0)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Step 2: Identifying owners
      setCurrentStep(1)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Step 3: Extracting tasks
      setCurrentStep(2)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Step 4: Generating insights
      setCurrentStep(3)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate Randomized Mock Data
      const generateRandomTasks = (): Task[] => {
        const count = Math.floor(Math.random() * 5) + 3 // 3 to 7 tasks
        const titles = [
          'Draft Q4 marketing report',
          'Schedule follow-up with design',
          'Finalize budget allocation',
          'Review security compliance',
          'Update user documentation',
          'Prepare client presentation',
          'Optimize database queries',
          'Fix navigation bug',
          'Conduct user interviews',
        ]
        const assignees = ['John Doe', 'Sarah Smith', 'Mark Johnson', 'Emily Chen', 'Alex Wong']
        const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low']
        const statuses: ('To Do' | 'In Progress' | 'Done')[] = ['To Do', 'In Progress', 'Done']

        return Array.from({ length: count }).map(() => ({
          id: crypto.randomUUID(),
          title: titles[Math.floor(Math.random() * titles.length)],
          assignee: assignees[Math.floor(Math.random() * assignees.length)],
          dueDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
        }))
      }

      const generateRandomRisks = (): Risk[] => {
        const count = Math.floor(Math.random() * 2) + 1 // 1 to 2 risks
        const descriptions = [
          'Budget overrun risk due to scope creep',
          'Timeline delay due to resource shortage',
          'Technical debt accumulation',
          'Third-party API dependency issues',
          'Potential security vulnerability in auth flow',
        ]
        const severities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low']

        return Array.from({ length: count }).map(() => ({
          id: crypto.randomUUID(),
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          probability: 'Medium',
          mitigation: 'Monitor closely and adjust plan',
        }))
      }

      const generateRandomDecisions = (): Decision[] => {
        const count = Math.floor(Math.random() * 3) + 1 // 1 to 3 decisions
        const descriptions = [
          'Approved budget increase for Q4',
          'Prioritize mobile app development',
          'Switch to new cloud provider',
          'Hire two new frontend engineers',
          'Postpone feature X to next quarter',
        ]

        return Array.from({ length: count }).map(() => ({
          id: crypto.randomUUID(),
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          date: new Date().toISOString(),
        }))
      }

      const mockTasks = generateRandomTasks()
      const mockRisks = generateRandomRisks()
      const mockDecisions = generateRandomDecisions()

      const mockSummary = `
        The team reviewed recent performance metrics and identified key areas for improvement. 
        Discussions centered around ${mockTasks[0]?.title || 'project goals'} and the need to allocate more resources.
        It was decided to ${mockDecisions[0]?.description.toLowerCase() || 'move forward with the plan'}.
      `

      // Save to Service
      meetingService.updateMeeting(meetingId, {
        status: MeetingStatus.COMPLETED,
        tasks: mockTasks,
        risks: mockRisks,
        decisions: mockDecisions,
        summary: mockSummary,
        mom: 'Generated MoM content...',
      })

      // Redirect to Meeting Details
      navigate(`/meetings/${meetingId}`)
    }

    processSteps()
  }, [meetingId, navigate])

  const steps = [
    { icon: FileText, label: 'Analyzing content' },
    { icon: Users, label: 'Identifying owners' },
    { icon: CheckCircle, label: 'Extracting tasks' },
    { icon: Brain, label: 'Generating insights' },
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
            let status = 'pending'
            if (index < currentStep) status = 'complete'
            if (index === currentStep) status = 'active'

            return (
              <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div
                  className={`p-2 rounded-lg ${
                    status === 'complete'
                      ? 'bg-green-100 text-green-600'
                      : status === 'active'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`text-sm font-medium ${
                    status === 'complete' ? 'text-green-600' : status === 'active' ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                {status === 'active' && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {status === 'complete' && (
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
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIProcessing
