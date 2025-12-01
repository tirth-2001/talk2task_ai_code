import React from 'react'
import { useNavigate } from 'react-router-dom'

import { FileText, MessageSquare, Upload } from 'lucide-react'

import { Button, FeatureCard } from '@/components'

const InputSelection: React.FC = () => {
  const navigate = useNavigate()

  const inputOptions = [
    {
      icon: <FileText size={32} />,
      title: 'Upload Meeting Summary',
      description: 'Use Copilot/Gemini/Meet notes',
    },
    {
      icon: <MessageSquare size={32} />,
      title: 'Paste Text or Transcript',
      description: 'Paste raw transcripts',
    },
    {
      icon: <Upload size={32} />,
      title: 'Paste Chat Snippets',
      description: 'Copy messages from Slack/Teams',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
            Turn Conversations into Actions
          </h1>
          <p className="text-base font-normal text-gray-500 max-w-lg">
            Choose an input method to get started. Our AI will analyze the content to identify key tasks, owners, and
            deadlines.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {inputOptions.map((option, index) => (
            <FeatureCard
              key={index}
              icon={option.icon}
              title={option.title}
              description={option.description}
              onClick={() => {
                const tab = option.title.includes('Upload') ? 'upload' : 'paste'
                navigate(`/input-form?tab=${tab}`)
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-sm pt-4">
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/input-form')}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InputSelection
