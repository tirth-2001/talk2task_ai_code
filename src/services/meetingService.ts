import { type Meeting, MeetingStatus, MeetingType, type Task, type Risk, type Decision } from '@/types/meeting'

const STORAGE_KEY = 'talk2task_meetings'

export const meetingService = {
  getAllMeetings: (): Meeting[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error fetching meetings:', error)
      return []
    }
  },

  getMeetingById: (id: string): Meeting | undefined => {
    const meetings = meetingService.getAllMeetings()
    return meetings.find((m) => m.id === id)
  },

  createMeeting: (meeting: Partial<Meeting>): Meeting => {
    const meetings = meetingService.getAllMeetings()
    
    const newMeeting: Meeting = {
      id: crypto.randomUUID(),
      title: meeting.title || 'Untitled Meeting',
      date: new Date().toISOString(),
      type: meeting.type || MeetingType.TEXT,
      status: meeting.status || MeetingStatus.PROCESSING,
      tasks: [],
      risks: [],
      decisions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...meeting
    }

    meetings.unshift(newMeeting) // Add to top
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings))
    return newMeeting
  },

  updateMeeting: (id: string, updates: Partial<Meeting>): Meeting | undefined => {
    const meetings = meetingService.getAllMeetings()
    const index = meetings.findIndex((m) => m.id === id)
    
    if (index === -1) return undefined

    const updatedMeeting = {
      ...meetings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    meetings[index] = updatedMeeting
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings))
    return updatedMeeting
  },

  deleteMeeting: (id: string): void => {
    const meetings = meetingService.getAllMeetings()
    const filtered = meetings.filter((m) => m.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },

  // Helper to add tasks to a meeting
  addTasks: (meetingId: string, tasks: Task[]): Meeting | undefined => {
    const meeting = meetingService.getMeetingById(meetingId)
    if (!meeting) return undefined

    return meetingService.updateMeeting(meetingId, {
      tasks: [...meeting.tasks, ...tasks]
    })
  },

  getDashboardStats: () => {
    const meetings = meetingService.getAllMeetings()
    
    // 1. Totals
    const totalMeetings = meetings.length
    const allTasks = meetings.flatMap(m => m.tasks)
    const allRisks = meetings.flatMap(m => m.risks)
    const totalTasks = allTasks.length
    const totalRisks = allRisks.length

    // 2. Upcoming Deadlines (Next 7 days)
    const now = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(now.getDate() + 7)
    
    const upcomingDeadlines = allTasks.filter(t => {
      const dueDate = new Date(t.dueDate)
      return dueDate >= now && dueDate <= nextWeek && t.status !== 'Done'
    }).length

    // 3. Task Status Distribution
    const taskStatusCounts = allTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const taskStatusData = [
      { name: 'To Do', value: taskStatusCounts['To Do'] || 0 },
      { name: 'In Progress', value: taskStatusCounts['In Progress'] || 0 },
      { name: 'Done', value: taskStatusCounts['Done'] || 0 }
    ]

    // 4. Risk Severity Distribution
    const riskSeverityCounts = allRisks.reduce((acc, risk) => {
      acc[risk.severity] = (acc[risk.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const riskData = [
      { name: 'Low', value: riskSeverityCounts['Low'] || 0 },
      { name: 'Medium', value: riskSeverityCounts['Medium'] || 0 },
      { name: 'High', value: riskSeverityCounts['High'] || 0 }
    ]

    // 5. Recent Meetings (Top 3)
    // Assuming meetings are already sorted by date desc (unshifted), but let's be safe
    const recentMeetings = [...meetings]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)

    return {
      totalTasks,
      totalRisks,
      totalMeetings,
      upcomingDeadlines,
      taskStatusData,
      riskData,
      recentMeetings
    }
  }
}
