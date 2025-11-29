import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Calendar, Clock, FileText, CheckCircle, 
  AlertTriangle, MessageSquare, Share2, Download, ChevronRight 
} from 'lucide-react'
import { meetingService } from '@/services/meetingService'
import { type Meeting } from '@/types/meeting'
import { Button } from '@/components'

const MeetingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState<Meeting | undefined>(undefined)

  useEffect(() => {
    if (id) {
      const data = meetingService.getMeetingById(id)
      if (data) {
        setMeeting(data)
      } else {
        // Handle not found
        navigate('/meetings')
      }
    }
  }, [id, navigate])

  if (!meeting) return null

  const stats = [
    { 
      label: 'Action Items', 
      value: meeting.tasks.length, 
      icon: CheckCircle, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      link: `/tasks?meetingId=${meeting.id}`
    },
    { 
      label: 'Risks Identified', 
      value: meeting.risks.length, 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      link: `/follow-up?meetingId=${meeting.id}` 
    },
    { 
      label: 'Minutes of Meeting', 
      value: 'Ready', 
      icon: FileText, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      link: `/mom?meetingId=${meeting.id}`
    },
  ]

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <button 
          onClick={() => navigate('/meetings')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ArrowLeft size={20} />
          Back to Meetings
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{meeting.title}</h1>
            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(meeting.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{new Date(meeting.date).toLocaleTimeString(undefined, { timeStyle: 'short' })}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium uppercase tracking-wide">
                {meeting.type}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              size="md" 
              className="flex items-center gap-2"
              icon={<Share2 size={18} />}
            >
              Share
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              className="flex items-center gap-2"
              icon={<Download size={18} />}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index}
              onClick={() => navigate(stat.link)}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Content Preview (Placeholder for now) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare size={24} className="text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900">Meeting Summary</h2>
        </div>
        <div className="prose max-w-none text-gray-600">
          <p>
            {meeting.summary || "No summary available for this meeting yet. Please check the AI Processing status."}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MeetingDetails
