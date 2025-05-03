import create from "zustand"

export const useNodesStore = create((set) => ({
  nodes: [],
  selectedNode: null,

  setNodes: (nodes) => set({ nodes }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    })),
  removeNode: (id) =>
    set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),

  selectNode: (node) => set({ selectedNode: node }),
  clearSelectedNode: () => set({ selectedNode: null }),
}))