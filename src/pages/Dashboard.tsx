import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { CheckCircle, AlertTriangle, Clock, Calendar, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { meetingService } from '@/services/meetingService'
import { type DashboardStats } from '@/types/meeting'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const data = meetingService.getDashboardStats()
    setStats(data)
  }, [])

  if (!stats) return null

  const statCards = [
    { 
      label: 'Total Tasks', 
      value: stats.totalTasks.toString(), 
      change: 'All Time', 
      icon: CheckCircle, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Risks Detected', 
      value: stats.totalRisks.toString(), 
      change: 'All Time', 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50' 
    },
    {
      label: 'Meetings Processed',
      value: stats.totalMeetings.toString(),
      change: 'All Time',
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Upcoming Deadlines',
      value: stats.upcomingDeadlines.toString(),
      change: 'Next 7 Days',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  const COLORS = ['#10B981', '#F59E0B', '#EF4444']

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      meetingService.deleteMeeting(id)
      setStats(meetingService.getDashboardStats()) // Refresh stats
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Overview of your meetings and tasks.</p>
        </div>
        <button 
          onClick={() => navigate('/input-selection')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          New Meeting
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={clsx('p-3 rounded-lg', stat.bg, stat.color)}>
                  <Icon size={24} />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Task Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.taskStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#5D0EC0" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Risk Analysis</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.riskData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {stats.riskData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Meetings */}
      {/* <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Meetings</h3>
          <button 
            onClick={() => navigate('/meetings')}
            className="text-primary text-sm font-medium hover:text-primary/90"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {stats.recentMeetings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No meetings yet.</div>
          ) : (
            stats.recentMeetings.map((meeting) => (
              <div 
                key={meeting.id} 
                onClick={() => navigate(`/meetings/${meeting.id}`)}
                className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">{meeting.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(meeting.date).toLocaleDateString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-500" />
                    <span className="text-sm text-gray-600">{meeting.tasks.length} Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className={meeting.risks.length > 0 ? 'text-red-500' : 'text-gray-300'} />
                    <span className="text-sm text-gray-600">{meeting.risks.length} Risks</span>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, meeting.id)}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div> */}
    </div>
  )
}

export default Dashboard
