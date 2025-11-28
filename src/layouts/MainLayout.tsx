import React from 'react'
import { useLocation } from 'react-router-dom'

import clsx from 'clsx'
import {
  LayoutDashboard,
  Upload,
  FileText,
  Cpu,
  ListTodo,
  FileOutput,
  MessageSquare,
  ArrowRightCircle,
  Workflow,
  Menu,
} from 'lucide-react'
import { NavItem } from '@/components'

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/input-selection', label: 'Input Selection', icon: Upload },
    { path: '/input-form', label: 'Input Form', icon: FileText },
    { path: '/ai-processing', label: 'AI Processing', icon: Cpu },
    { path: '/tasks', label: 'Task Table', icon: ListTodo },
    { path: '/mom', label: 'MoM Generation', icon: FileOutput },
    { path: '/slack', label: 'Slack Reminder', icon: MessageSquare },
    { path: '/follow-up', label: 'Follow Up', icon: ArrowRightCircle },
    { path: '/automation', label: 'Automation Studio', icon: Workflow },
  ]

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside
        className={clsx(
          'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
          isSidebarOpen ? 'w-64' : 'w-20',
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          {isSidebarOpen && <span className="font-bold text-xl text-primary">Talk2Task AI</span>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavItem
                  path={item.path}
                  label={item.label}
                  icon={item.icon}
                  isActive={location.pathname === item.path}
                  isCollapsed={!isSidebarOpen}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              TP
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Tirth Patel</p>
                <p className="text-xs text-gray-500 truncate">Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="w-full mx-auto">{children}</div>
      </main>
    </div>
  )
}

export default MainLayout
