import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Calendar, CheckCircle, AlertTriangle, Trash2, Plus, Search, Filter } from 'lucide-react'

import { Button, PageHeader } from '@/components'
import { useToast } from '@/context/ToastContext'
import { meetingService } from '@/services/meetingService'
import { type Meeting, MeetingStatus } from '@/types/meeting'

const Meetings: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // Load meetings from service
    const data = meetingService.getAllMeetings()
    setMeetings(data)
  }, [])

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = statusFilter === 'all' || m.status === statusFilter
    return matchesSearch && matchesFilter
  })

  const handleMeetingClick = (id: string) => {
    navigate(`/meetings/${id}`)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      meetingService.deleteMeeting(id)
      setMeetings(meetingService.getAllMeetings())
      showToast('Meeting deleted successfully', 'success')
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Meetings"
        description="Manage and review your processed meetings."
        action={
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/input-selection')}
            className="flex items-center gap-2"
            icon={<Plus size={18} />}
          >
            New Meeting
          </Button>
        }
      />

      {/* Filters & Search */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search meetings..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
            <Filter size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value={MeetingStatus.COMPLETED}>Completed</option>
              <option value={MeetingStatus.PROCESSING}>Processing</option>
              <option value={MeetingStatus.FAILED}>Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredMeetings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No meetings found</h3>
            <p className="mb-6">Get started by processing your first meeting.</p>
            <Button variant="primary" size="md" onClick={() => navigate('/input-selection')}>
              Start New Meeting
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => handleMeetingClick(meeting.id)}
                className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{meeting.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(meeting.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2" title="Tasks Extracted">
                      <CheckCircle size={18} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">{meeting.tasks.length} Tasks</span>
                    </div>
                    <div className="flex items-center gap-2" title="Risks Identified">
                      <AlertTriangle
                        size={18}
                        className={meeting.risks.length > 0 ? 'text-red-500' : 'text-gray-300'}
                      />
                      <span className="text-sm font-medium text-gray-700">{meeting.risks.length} Risks</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`
                    px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${meeting.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                    ${meeting.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                    ${meeting.status === 'failed' ? 'bg-red-100 text-red-700' : ''}
                  `}
                  >
                    {meeting.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMeetingClick(meeting.id)
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, meeting.id)}
                      className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors"
                      title="Delete Meeting"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Meetings
