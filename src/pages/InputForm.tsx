import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Textarea, Tabs, UploadZone } from '@/components'
import type { Tab } from '@/components'
import { meetingService } from '@/services/meetingService'
import { MeetingType } from '@/types/meeting'

import { useToast } from '@/context/ToastContext'

const InputForm: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const [inputText, setInputText] = useState('')
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste')

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'upload' || tabParam === 'paste') {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleSubmit = () => {
    if (inputText.trim() || activeTab === 'upload') {
      // Create a new meeting
      const newMeeting = meetingService.createMeeting({
        title: `Meeting on ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        type: activeTab === 'paste' ? MeetingType.TEXT : MeetingType.FILE,
        inputContent: activeTab === 'paste' ? inputText : 'File Uploaded'
      })

      showToast('Meeting created successfully', 'success')

      // Redirect to processing with the new ID
      navigate(`/ai-processing?meetingId=${newMeeting.id}`)
    }
  }

  const tabs: Tab[] = [
    { id: 'paste', label: 'Paste Summary' },
    { id: 'upload', label: 'Upload File' },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          {/* Section Header */}
          <h2 className="text-2xl font-bold text-gray-900 pb-3 pt-5">Paste or Upload Meeting Summary</h2>

          {/* Tabs */}
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as 'paste' | 'upload')}
          />

          {/* Text Field */}
          {activeTab === 'paste' ? (
            <div className="flex flex-col gap-4 py-3">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste Copilot/Gemini/Meet summary here…"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-3">
              <UploadZone />
            </div>
          )}

          {/* Meta Text */}
          <p className="text-gray-500 text-sm font-normal leading-normal pb-3 pt-1">
            Supports AI-generated summaries, transcripts, and raw text.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-auto py-6">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            disabled={!inputText.trim() && activeTab === 'paste'}
          >
            Extract Action Items
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InputForm
