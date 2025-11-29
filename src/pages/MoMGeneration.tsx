import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, Clock, Download, Share2, Users, ArrowLeft } from 'lucide-react'
import { meetingService } from '@/services/meetingService'
import { type Meeting } from '@/types/meeting'
import { Button } from '@/components'

const MoMGeneration: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const meetingId = searchParams.get('meetingId')
  const [meeting, setMeeting] = useState<Meeting | undefined>(undefined)

  useEffect(() => {
    if (meetingId) {
      const data = meetingService.getMeetingById(meetingId)
      if (data) {
        setMeeting(data)
      }
    }
  }, [meetingId])

  if (!meetingId) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">No Meeting Selected</h2>
        <p className="text-gray-500 mb-6">Please select a meeting to view its minutes.</p>
        <Button variant="primary" size="md" onClick={() => navigate('/meetings')}>
          Go to Meetings
        </Button>
      </div>
    )
  }

  if (!meeting) return null

  // Mock attendees for now as it's not in the Meeting model yet
  const attendees = ['John Doe', 'Sarah Smith', 'Mark Johnson']

  return (
    <div className="p-8 max-w-4xl mx-auto">
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

          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight text-gray-900">Minutes of Meeting</h1>
              <p className="text-base text-gray-500">Auto-generated summary of your meeting</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center px-4 h-10 bg-transparent text-gray-700 text-sm font-medium rounded-lg gap-2 border border-gray-300 hover:bg-gray-100 transition-colors">
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button className="flex items-center justify-center px-4 h-10 bg-primary text-white text-sm font-medium rounded-lg gap-2 hover:bg-primary/90 transition-colors">
                <Download size={16} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Meeting Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Meeting Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{meeting.title}</h2>

          {/* Meeting Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(meeting.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(meeting.date).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Attendees</p>
                <p className="text-sm font-medium text-gray-900">{attendees.length} participants</p>
              </div>
            </div>
          </div>

          {/* Attendees List */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Participants</h3>
            <div className="flex flex-wrap gap-2">
              {attendees.map((attendee, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {attendee
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <span>{attendee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Summary</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {meeting.summary || "No summary available."}
            </p>
          </div>

          {/* Decisions Section */}
          {meeting.decisions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Decisions Made</h3>
              <ul className="space-y-2">
                {meeting.decisions.map((decision) => (
                  <li key={decision.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-relaxed">{decision.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items Section */}
          {meeting.tasks.length > 0 && (
            <div className="mb-6 last:mb-0">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Action Items</h3>
              <ul className="space-y-2">
                {meeting.tasks.map((task) => (
                  <li key={task.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-medium">{task.assignee}</span> to {task.title} by {task.dueDate}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MoMGeneration
