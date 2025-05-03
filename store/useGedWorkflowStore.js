import {create} from 'zustand'

export const useGedWorkflowStore = create((set) => ({
  workflows: [],
  selectedWorkflow: null,
  setWorkflows: (workflows) => set({ workflows }),
  setSelectedWorkflow: (workflow) => set({ selectedWorkflow: workflow }),
}))