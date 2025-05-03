"use client"

import { useState, useEffect } from "react"
import { Search, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { syncGedWorkflows, getGedWorkflows } from "@/lib/api"
import { useGedWorkflowStore } from "@/store/useGedWorkflowStore"

export function WorkflowSelector() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)
  const { workflows, selectedWorkflow, setWorkflows, setSelectedWorkflow } =useGedWorkflowStore()
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const fetched = await getGedWorkflows()
        setWorkflows(fetched)
      } catch (error) {
        console.error("Error fetching workflows:", error)
      }
    }
    fetchWorkflows()
  }, [setWorkflows])

  // Filter workflows using the live data from ged_workflows
  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.department?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      // Sync workflows and fetch updated data
      await syncGedWorkflows({})
      const fetched = await getGedWorkflows()
      setWorkflows(fetched)
    } catch (error) {
      console.error("Error syncing workflows:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSelectWorkflow = (workflowId) => {
    const workflow = workflows.find((wf) => wf.id === workflowId)
    setSelectedWorkflow(workflow)
    console.log(selectedWorkflow)
  }

  

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Select GED Workflow</h2>
        <p className="text-muted-foreground mb-6">
          Choose an existing GED workflow. This will be the foundation for
          your HR automation project.
        </p>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleSync} variant="outline" className="mb-6">
          <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Workflows"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow) => (
          <Card
            key={workflow.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedWorkflow?.id === workflow.id ? "border-2 border-primary" : ""
            }`}
            onClick={() => handleSelectWorkflow(workflow.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{workflow.title}</CardTitle>
              <CardDescription>{workflow.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department:</span>
                  <Badge variant="outline">{workflow.department}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(workflow.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedWorkflow?.id === workflow.id ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSelectWorkflow(workflow.id)}
              >
                {selectedWorkflow?.id === workflow.id ? "Selected" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No workflows found</h3>
          <p className="text-muted-foreground">Try adjusting your search query</p>
        </div>
      )}
    </div>
  )
}