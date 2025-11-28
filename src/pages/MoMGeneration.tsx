import React from 'react'

import { Calendar, Clock, Download, Share2, Users } from 'lucide-react'

const MoMGeneration: React.FC = () => {
  const meetingDetails = {
    title: 'Q4 Product Planning Meeting',
    date: 'October 23, 2023',
    time: '2:00 PM - 3:30 PM',
    attendees: ['John Doe', 'Sarah Smith', 'Mark Johnson', 'Emily Chen'],
  }

  const sections = [
    {
      title: 'Key Discussion Points',
      items: [
        'Reviewed Q3 performance metrics and identified areas for improvement',
        'Discussed new feature requests from enterprise clients',
        'Evaluated current resource allocation and team capacity',
      ],
    },
    {
      title: 'Decisions Made',
      items: [
        'Approved budget increase for marketing initiatives in Q4',
        'Decided to prioritize mobile app development over web features',
        'Agreed to hire two additional engineers by end of November',
      ],
    },
    {
      title: 'Action Items',
      items: [
        'John to draft Q4 marketing report by Oct 26',
        'Sarah to schedule follow-up with design team by Nov 2',
        'Mark to finalize budget allocation by Oct 24',
        'Emily to review press release by Oct 28',
      ],
    },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
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

        {/* Meeting Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Meeting Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{meetingDetails.title}</h2>

          {/* Meeting Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">{meetingDetails.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium text-gray-900">{meetingDetails.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Attendees</p>
                <p className="text-sm font-medium text-gray-900">{meetingDetails.attendees.length} participants</p>
              </div>
            </div>
          </div>

          {/* Attendees List */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Participants</h3>
            <div className="flex flex-wrap gap-2">
              {meetingDetails.attendees.map((attendee, index) => (
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

          {/* Sections */}
          {sections.map((section, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MoMGeneration
