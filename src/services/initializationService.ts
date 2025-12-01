import meetingsData from '@/mocks/meetings.json'
import workflowsData from '@/mocks/workflows.json'

const INIT_KEY = 'talk2task_initialized'
const MEETINGS_KEY = 'talk2task_meetings'
const WORKFLOWS_KEY = 'talk2task_workflows'

export const initializationService = {
  /**
   * Initialize the app with mock data if it hasn't been initialized yet.
   * This ensures judges see a populated dashboard immediately.
   */
  initialize: (): void => {
    try {
      // Check if already initialized
      const isInitialized = localStorage.getItem(INIT_KEY)

      if (isInitialized) {
        console.log('App already initialized with mock data')
        return
      }

      // Load mock meetings
      const existingMeetings = localStorage.getItem(MEETINGS_KEY)
      if (!existingMeetings) {
        localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetingsData))
        console.log('Loaded mock meetings data')
      }

      // Load mock workflows
      const existingWorkflows = localStorage.getItem(WORKFLOWS_KEY)
      if (!existingWorkflows) {
        localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflowsData))
        console.log('Loaded mock workflows data')
      }

      // Mark as initialized with timestamp
      localStorage.setItem(INIT_KEY, new Date().toISOString())
      console.log('App initialization complete')
    } catch (error) {
      console.error('Error initializing app:', error)
    }
  },

  /**
   * Reset the initialization flag (useful for testing)
   */
  reset: (): void => {
    localStorage.removeItem(INIT_KEY)
    console.log('Initialization flag reset')
  },

  /**
   * Check if the app has been initialized
   */
  isInitialized: (): boolean => {
    return !!localStorage.getItem(INIT_KEY)
  },
}
