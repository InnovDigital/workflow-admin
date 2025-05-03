"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { getNodeTypes } from "@/lib/api"

export function NodeTypeSelector({ onSelect, onClose }) {
  const [nodeTypes, setNodeTypes] = useState([])

  useEffect(() => {
    getNodeTypes()
      .then(setNodeTypes)
      .catch((err) => console.error("Error loading node types:", err))
  }, [])

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[50vw] max-w-[100vw]">
        <DialogTitle>
          <VisuallyHidden>Select Node Type</VisuallyHidden>
        </DialogTitle>
        <Alert variant="default">
          <AlertTitle>Select Node Type</AlertTitle>
          <AlertDescription>Please choose a node type from below:</AlertDescription>
        </Alert>

        <Tabs defaultValue="all" className="w-full mt-4">
          <TabsContent value="all">
            <ScrollArea className="h-[300px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {nodeTypes.map((nt) => (
                  <Button
                    key={nt.name}
                    variant="outline"
                    className="flex flex-col items-start p-3 text-left"
                    // pass id, name, fields
                    onClick={() => onSelect(nt.id, nt.name, nt.fields)}
                  >
                    <div className="font-medium">{nt.name}</div>
                    <div className="text-xs text-muted-foreground truncate mb-1">
                      {nt.description || "No description"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {nt.fields &&
                        Object.entries(nt.fields).map(([key, val]) => (
                          <div key={key}>
                            <span className="font-semibold">{key}:</span> {String(val)}
                          </div>
                        ))}
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}