import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Textarea, Tabs, UploadZone } from '@/components'
import type { Tab } from '@/components'

const InputForm: React.FC = () => {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste')

  const handleSubmit = () => {
    if (inputText.trim()) {
      navigate('/ai-processing')
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
