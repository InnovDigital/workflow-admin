"use client"

import { useState } from "react"
import { FileText, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useGedWorkflowStore } from "@/store/useGedWorkflowStore"
import { createWorkflow,getGedWorkflows } from "@/lib/api"

export function WorkflowPreview() {
  const [activeTab, setActiveTab] = useState("documents")
  const { selectedWorkflow } = useGedWorkflowStore()


  const handleCreateWorkflow = async () => {
    if (!selectedWorkflow) return

    try {
      // 1) create workflow
      const { workflow_id } = await createWorkflow({
        ged_workflow_id: selectedWorkflow.id,
      })
      console.log("createWorkflow result:", workflow_id)

      // 2) fetch its nodes and log them
      const nodes = await getWorkflowNodes(workflow_id)
      console.log("Fetched workflow nodes:", nodes)
    } catch (err) {
      console.error("Error in workflow creation or fetching nodes:", err)
    }
  }

  // If no workflow is selected, default documents to empty array
  const documents = selectedWorkflow?.documents || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Workflow Preview</h2>
        <p className="text-muted-foreground mb-6">
          Review the selected GED workflow before configuring automation nodes.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="structure">Workflow Structure</TabsTrigger>
          <TabsTrigger value="preview">Document Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Documents</CardTitle>
              <CardDescription>
                {documents.length > 0
                  ? "Documents included in this workflow"
                  : "No documents found."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Action Required</TableHead>
                      <TableHead className="text-right">Preview</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>{doc.stage}</TableCell>
                        <TableCell>
                          {doc.requiredAction ? (
                            <Badge className="bg-yellow-500 text-white">
                              Required
                            </Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">
                  This workflow does not contain any documents.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Structure</CardTitle>
              <CardDescription>
                Visual representation of the document flow
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              {selectedWorkflow?.tasks && selectedWorkflow.tasks.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-2xl bg-muted p-8 rounded-2xl flex flex-col items-center">
                    {selectedWorkflow.tasks.map((task, index) => (
                      <div key={task.id} className="flex flex-col items-center w-full">
                        <div className="bg-background border rounded-2xl p-4 w-64 text-center mb-4 relative">
                          {/* Position indicator: alternate left/right styling based on index */}
                          <div
                            className={`absolute ${index === 0
                                ? ""
                                : index % 2 === 1
                                  ? "-left-4"
                                  : "-right-4"
                              } top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-dashed border-yellow-500 flex items-center justify-center bg-background`}
                          >
                            <span className="text-yellow-500 text-xs">+</span>
                          </div>
                          <p className="font-medium">
                            {task.name ? task.name : task.type}
                          </p>
                          {task.details && (
                            <p className="text-xs text-muted-foreground">
                              Action needed
                            </p>
                          )}
                        </div>
                        {index !== selectedWorkflow.tasks.length - 1 && (
                          <div className="h-8 w-0.5 bg-border my-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Yellow indicators show where automation nodes can be added
                  </p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No tasks available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
              <CardDescription>
                Preview documents in this workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Select a document to preview
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Choose a document from the Documents tab to view its contents
              </p>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Sample
              </Button>
              <Button onClick={handleCreateWorkflow} variant="primary">
              Create Workflow
            </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}