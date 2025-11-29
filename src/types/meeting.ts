export const MeetingStatus = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type MeetingStatus = (typeof MeetingStatus)[keyof typeof MeetingStatus];

export const MeetingType = {
  AUDIO: 'audio',
  TEXT: 'text',
  FILE: 'file'
} as const;

export type MeetingType = (typeof MeetingType)[keyof typeof MeetingType];

export interface Task {
  id: string
  title: string
  assignee: string
  dueDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'To Do' | 'In Progress' | 'Done'
}

export interface Risk {
  id: string
  description: string
  severity: 'High' | 'Medium' | 'Low'
  probability: 'High' | 'Medium' | 'Low'
  mitigation?: string
}

export interface Decision {
  id: string
  description: string
  owner?: string
  date: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  duration?: string
  type: MeetingType
  status: MeetingStatus
  inputContent?: string // The raw text or file name
  
  // Outputs
  summary?: string
  tasks: Task[]
  risks: Risk[]
  decisions: Decision[]
  mom?: string // HTML/Markdown content
  
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalTasks: number
  totalRisks: number
  totalMeetings: number
  upcomingDeadlines: number
  taskStatusData: { name: string; value: number }[]
  riskData: { name: string; value: number }[]
  recentMeetings: Meeting[]
}
