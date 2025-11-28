import React from 'react'

import clsx from 'clsx'
import { CheckCircle, AlertTriangle, Clock, Calendar, MoreHorizontal } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Dashboard: React.FC = () => {
  // Mock Data
  const stats = [
    { label: 'Total Tasks', value: '24', change: '+12%', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Risks Detected', value: '3', change: '+1', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    {
      label: 'Meetings Processed',
      value: '8',
      change: '+3',
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Upcoming Deadlines',
      value: '5',
      change: 'This Week',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  const taskStatusData = [
    { name: 'To Do', value: 10 },
    { name: 'In Progress', value: 8 },
    { name: 'Review', value: 4 },
    { name: 'Done', value: 12 },
  ]

  const riskData = [
    { name: 'Low', value: 5 },
    { name: 'Medium', value: 3 },
    { name: 'High', value: 1 },
  ]

  const COLORS = ['#10B981', '#F59E0B', '#EF4444']

  const recentMeetings = [
    { id: 1, title: 'Product Sync', date: 'Today, 10:00 AM', tasks: 5, risks: 0 },
    { id: 2, title: 'Client Kickoff', date: 'Yesterday, 2:00 PM', tasks: 8, risks: 2 },
    { id: 3, title: 'Design Review', date: 'Nov 26, 11:00 AM', tasks: 3, risks: 1 },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Overview of your meetings and tasks.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          New Meeting
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
                <span
                  className={clsx(
                    'text-sm font-medium',
                    stat.change.includes('+') ? 'text-green-600' : 'text-gray-500',
                  )}
                >
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
              <BarChart data={taskStatusData}>
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
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {riskData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Meetings</h3>
          <button className="text-primary text-sm font-medium hover:text-primary/90">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {recentMeetings.map((meeting) => (
            <div key={meeting.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                  <p className="text-sm text-gray-500">{meeting.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-500" />
                  <span className="text-sm text-gray-600">{meeting.tasks} Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className={meeting.risks > 0 ? 'text-red-500' : 'text-gray-300'} />
                  <span className="text-sm text-gray-600">{meeting.risks} Risks</span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
