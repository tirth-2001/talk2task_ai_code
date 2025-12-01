import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import AIProcessing from '@/pages/AIProcessing'
import AutomationStudio from '@/pages/AutomationStudio'
import Dashboard from '@/pages/Dashboard'
import FollowUpSuggestions from '@/pages/FollowUpSuggestions'
import InputForm from '@/pages/InputForm'
import InputSelection from '@/pages/InputSelection'
import MoMGeneration from '@/pages/MoMGeneration'
import SlackReminder from '@/pages/SlackReminder'
import TaskTable from '@/pages/TaskTable'
import WorkflowBuilder from '@/pages/WorkflowBuilder'
import Meetings from '@/pages/Meetings'
import MeetingDetails from '@/pages/MeetingDetails'
import { initializationService } from '@/services/initializationService'

// Initialize app with mock data on first load
initializationService.initialize()

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/meetings/:id" element={<MeetingDetails />} />
          <Route path="/input-selection" element={<InputSelection />} />
          <Route path="/input-form" element={<InputForm />} />
          <Route path="/ai-processing" element={<AIProcessing />} />
          <Route path="/tasks" element={<TaskTable />} />
          <Route path="/mom" element={<MoMGeneration />} />
          <Route path="/slack" element={<SlackReminder />} />
          <Route path="/follow-up" element={<FollowUpSuggestions />} />
          <Route path="/automation" element={<AutomationStudio />} />
          <Route path="/workflow-builder" element={<WorkflowBuilder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
