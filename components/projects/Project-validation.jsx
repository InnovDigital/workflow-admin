"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Clock, Play, RefreshCw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

const initialNodes = [
  { id: "1", name: "Document Input", type: "input", status: "pending" },
  { id: "2", name: "SQL Query", type: "sql", status: "pending" },
  { id: "3", name: "User Validation", type: "user-validation", status: "pending" },
  { id: "4", name: "Email Send", type: "email-send", status: "pending" },
  { id: "5", name: "Document Upload", type: "document-upload", status: "pending" },
]

export function ProjectValidation() {
  const [nodes, setNodes] = useState(initialNodes)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [validationComplete, setValidationComplete] = useState(false)
  const [validationSuccess, setValidationSuccess] = useState(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-muted-foreground" />
      case "running":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "skipped":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const runValidation = () => {
    setIsRunning(true)
    setProgress(0)
    setValidationComplete(false)
    setValidationSuccess(false)

    // Reset node statuses
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        status: "pending",
        message: undefined,
        details: undefined,
      }))
    )

    const totalNodes = nodes.length
    let currentNodeIndex = 0

    const processNextNode = () => {
      if (currentNodeIndex >= totalNodes) {
        setIsRunning(false)
        setValidationComplete(true)
        // Check if all nodes are successful
        const allSuccess = nodes.every((node) => node.status === "success")
        setValidationSuccess(allSuccess)
        return
      }

      // Update current node to running
      setNodes((prev) =>
        prev.map((node, index) => {
          if (index === currentNodeIndex) {
            return { ...node, status: "running" }
          }
          return node
        })
      )

      // Update progress (midpoint)
      setProgress(Math.round(((currentNodeIndex + 0.5) / totalNodes) * 100))

      // Simulate node processing delay
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((node, index) => {
            if (index === currentNodeIndex) {
              // Simulate an error for the SQL Query node
              if (node.type === "sql") {
                return {
                  ...node,
                  status: "error",
                  message: "Database connection failed",
                  details:
                    "Could not connect to HR database. Check credentials and network.",
                }
              }
              return {
                ...node,
                status: "success",
                message: "Validation successful",
              }
            }
            // If any previous node failed, skip subsequent nodes
            if (
              index > currentNodeIndex &&
              prev.some((n, i) => i < index && n.status === "error")
            ) {
              return {
                ...node,
                status: "skipped",
                message: "Skipped due to previous error",
              }
            }
            return node
          })
        )

        // Update progress after processing
        setProgress(Math.round(((currentNodeIndex + 1) / totalNodes) * 100))

        currentNodeIndex++
        processNextNode()
      }, 1500)
    }

    processNextNode()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Project Validation</h2>
        <p className="text-muted-foreground mb-6">
          Validate your workflow by running a dry-run simulation. This will test
          each node without executing actual actions.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex-1 mr-4">
          <Progress value={progress} className="h-2" />
        </div>
        <Button onClick={runValidation} disabled={isRunning}>
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? "Running..." : "Run Validation"}
        </Button>
      </div>

      <div className="space-y-4">
        {nodes.map((node) => (
          <Card key={node.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">{node.name}</CardTitle>
                  <CardDescription>{node.type}</CardDescription>
                </div>
                {getStatusIcon(node.status)}
              </div>
            </CardHeader>
            {node.message && (
              <CardContent>
                <div
                  className={`text-sm ${
                    node.status === "error"
                      ? "text-red-500"
                      : node.status === "skipped"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {node.message}
                </div>
                {node.details && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {node.details}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {validationComplete && (
        <Alert
          variant={validationSuccess ? "default" : "destructive"}
          className="mt-6"
        >
          <AlertTitle>
            {validationSuccess
              ? "Validation Successful"
              : "Validation Failed"}
          </AlertTitle>
          <AlertDescription>
            {validationSuccess
              ? "All nodes passed validation. You can now activate this project."
              : "Some nodes failed validation. Please fix the errors and try again."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}