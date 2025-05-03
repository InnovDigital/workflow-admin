"use client"

import { useCallback, useState, useRef,useEffect } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  reactFlowWrapper
} from "reactflow"
import "reactflow/dist/style.css"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CustomNode } from "@/components/projects/custom-node"

// Import the additional modals
import { NodeTitleEditor } from "@/components/projects/NodeTitleEditor"
import { NodeTypeSelector } from "@/components/projects/nodetype-selector"
import { NodeParamsEditor } from "./NodeParams"
import { useGedWorkflowStore } from "@/store/useGedWorkflowStore"
import { getWorkflowNodes } from "@/lib/api"

const nodeTypes = {
  custom: CustomNode,
}

const initialNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 50 },
    data: {
      label: "Document Input",
      type: "input",
      description: "Start of workflow",
      category: "document",
      params: {},
    },
  },
]

const initialEdges = []

export function WorkflowEditor({ onNodeSelect }) {
  const { selectedWorkflow } = useGedWorkflowStore()
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  // Replace your current useEffect with this:
  useEffect(() => {
    if (!selectedWorkflow?.id) return

    getWorkflowNodes(selectedWorkflow.id)
      .then((dbNodes) => {
        console.log("Workflow nodes from DB:", dbNodes)

        // Map DB rows → React Flow nodes
        const rfNodes = dbNodes.map((n, i) => ({
          id: n.id,
          type: "custom",
          position: { x: 100 + (i % 3) * 200, y: 50 + Math.floor(i / 3) * 150 },
          data: {
            label: n.name,
            type: n.node_type_id,
            description: n.description,
            category: "",    // or derive from n.node_type_id
            params: n.params || {},
          },
        }))

        // Build edges from depends_on arrays
        const rfEdges = dbNodes.flatMap((n) =>
          (n.depends_on || []).map((srcId) => ({
            id: `e-${srcId}-${n.id}`,
            source: srcId,
            target: n.id,
            animated: true,
          }))
        )

        setNodes(rfNodes)
        setEdges(rfEdges)
      })
      .catch((err) => {
        console.error("Failed to fetch workflow nodes:", err)
      })
  }, [selectedWorkflow])


  // States for editing
  const [editingNode, setEditingNode] = useState(null)
  const [showTitleEditor, setShowTitleEditor] = useState(false)
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [showParamsEditor, setShowParamsEditor] = useState(false)
  
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
    },
    []
  )

  // When clicking on a node:
  // - If the node is blank (i.e. no type), open the type selector.
  // - Otherwise, call onNodeSelect (or open the params editor).
  const onNodeClick = useCallback(
    (_e, node) => {
      if (!node.data.type) {
        setEditingNode(node)
        setShowTypeSelector(true)
      } else {
        setEditingNode(node)
        setShowParamsEditor(true)
      }
    },
    []
  )

  // When "Add Node" is clicked:
  // Create a blank node and open the title editor.
  const handleAddBlankNode = () => {
    const offsetY = 150
    const defaultX = 250
    const maxY = nodes.length > 0 ? Math.max(...nodes.map((n) => n.position.y)) : 50

    const newNode = {
      id: `node-${Date.now()}`,
      type: "custom",
      position: { x: defaultX, y: maxY + offsetY },
      data: {
        label: "New Node",
        type: "",
        description: "",
        category: "",
        params: {},
      },
    }

    setNodes((nds) => [...nds, newNode])
    setEditingNode(newNode)
    setShowTitleEditor(true)
  }

  // Update node title
  const updateNodeTitle = (title) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === editingNode.id
          ? { ...node, data: { ...node.data, label: title } }
          : node
      )
    )
    setShowTitleEditor(false)
  }

  // When a type is selected on a blank node, update its type and label, then open parameters editor.
  const handleTypeSelect = (type, label) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === editingNode.id
          ? {
              ...node,
              data: { ...node.data, type, label, category: type },
            }
          : node
      )
    )
    setShowTypeSelector(false)
    setShowParamsEditor(true)
  }

  // Update node parameters (from NodeParamsEditor) if needed.
  const handleParamsUpdate = (params) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === editingNode.id
          ? { ...node, data: { ...node.data, params } }
          : node
      )
    )
    setShowParamsEditor(false)
  }

  return (
    <div className="h-[600px] w-full relative">
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} className="h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background />
            <Controls />
            <MiniMap />
            <Panel position="top-right" className="bg-background border rounded-md shadow-sm p-2">
              <Button size="sm" onClick={handleAddBlankNode}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Node
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>

      {showTitleEditor && editingNode && (
        <NodeTitleEditor
          node={editingNode}
          onSave={updateNodeTitle}
          onClose={() => setShowTitleEditor(false)}
        />
      )}

      {showTypeSelector && editingNode && (
        <NodeTypeSelector
          onSelect={handleTypeSelect}
          onClose={() => setShowTypeSelector(false)}
        />
      )}

      {showParamsEditor && editingNode && (
        <NodeParamsEditor
          node={editingNode}
          onUpdate={handleParamsUpdate}
          onClose={() => setShowParamsEditor(false)}
        />
      )}
    </div>
  )
}