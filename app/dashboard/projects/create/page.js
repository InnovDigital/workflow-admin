"use client"

import { useState } from "react"
import { PageHeader } from "@/components/overview/project-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { WorkflowSelector } from "@/components/projects/workflow-selector"
import { WorkflowPreview } from "@/components/projects/workflow-preview"
import { WorkflowEditor } from "@/components/projects/workflow-editor"
import { ProjectValidation } from "@/components/projects/Project-validation"

// Placeholder components (replace these with your actual implementations)
const NodeParamsEditor = (props) => (
  <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "#f0f0f0" }}>
    NodeParamsEditor component placeholder - Node: {JSON.stringify(props.node)}
    <br />
    <Button onClick={props.onClose}>Close</Button>
  </div>
)

const ProjectSettings = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    ProjectSettings component placeholder
  </div>
)

export default function CreateProject() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [showNodeParams, setShowNodeParams] = useState(false)

  const totalSteps = 6

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNodeSelect = (node) => {
    setSelectedNode(node)
    setShowNodeParams(true)
  }

  const handleCloseNodeParams = () => {
    setShowNodeParams(false)
    setSelectedNode(null)
  }

  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Create HR Workflow Project"
        description="Set up a new automated workflow for HR document processing"
      />

      {/* Progress Indicator */}
      <div className="w-full bg-blue-50 rounded-2xl p-4">
        <div className="flex justify-between items-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className={`flex items-center ${index < totalSteps - 1 ? "flex-1" : ""}`}>
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  index + 1 === currentStep
                    ? "bg-blue-600 text-white"
                    : index + 1 < currentStep
                    ? "bg-blue-800 text-white"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    index + 1 < currentStep ? "bg-blue-800/80" : "bg-blue-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span>Select Workflow</span>
          <span className="flex-1 text-center">Preview</span>
          <span className="flex-1 text-center">Configure</span>
          <span className="flex-1 text-center">Set Parameters</span>
          <span className="flex-1 text-center">Validate</span>
          <span>Settings</span>
        </div>
      </div>

      <Card className="p-6">
        {currentStep === 1 && (
          <WorkflowSelector
            onSelect={(workflow) => setSelectedWorkflow(workflow)}
            selectedWorkflow={selectedWorkflow}
          />
        )}

        {currentStep === 2  && (
          <WorkflowPreview  />
        )}

        {currentStep === 3 && <WorkflowEditor onNodeSelect={handleNodeSelect} />}

        {currentStep === 4 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">Configure Node Parameters</h3>
            <p className="text-blue-600 mb-6">
              Select a node in the workflow to configure its parameters
            </p>
            <Button onClick={() => setShowNodeParams(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Open Parameter Editor
            </Button>
          </div>
        )}

        {currentStep === 5 && <ProjectValidation />}

        {currentStep === 6 && <ProjectSettings />}

        {showNodeParams && selectedNode && (
          <NodeParamsEditor node={selectedNode} onClose={handleCloseNodeParams} />
        )}
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="border-blue-600 text-blue-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep < totalSteps ? (
            <Button onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700 text-white">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Complete Setup</Button>
          )}
        </div>
      </div>
    </div>
  )
}