"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { X } from "lucide-react"

export function NodeTitleEditor({ node, onSave, onClose }) {
  const [title, setTitle] = useState(node?.data?.label || "")

  const handleSave = () => {
    onSave(title)
  }

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <Card className="w-[400px]">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Edit Node Title</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter node title"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="ml-2">
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}