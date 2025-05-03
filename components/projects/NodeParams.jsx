"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function NodeParamsEditor({ node, onUpdate, onClose }) {
  // Predefined basic fields (could come from server)
  const initialBasic = node.data.basicFields || [
    { name: "firstName", type: "string", value: "" },
    { name: "age", type: "number", value: 0 },
    { name: "email", type: "string", value: "" },
  ]

  // Advanced fields provided dynamically by the user – now without a "value"
  const [basicFields, setBasicFields] = useState(initialBasic)
  const [advancedFields, setAdvancedFields] = useState([])
  const [activeTab, setActiveTab] = useState("basic")
  const [validationErrors, setValidationErrors] = useState([])

  const handleBasicChange = (index, newVal) => {
    const updated = [...basicFields]
    updated[index].value = newVal
    setBasicFields(updated)
  }

  const handleAdvancedChange = (index, key, newVal) => {
    const updated = [...advancedFields]
    updated[index][key] = newVal
    setAdvancedFields(updated)
  }

  const addAdvancedField = () => {
    // Append a new advanced field with empty name and default type "string"
    setAdvancedFields([...advancedFields, { name: "", type: "string" }])
  }

  const removeAdvancedField = (index) => {
    const updated = advancedFields.filter((_, i) => i !== index)
    setAdvancedFields(updated)
  }

  const validateFields = () => {
    const errors = []

    // Basic fields: if any required field is empty.
    basicFields.forEach((field) => {
      if ((field.type === "string" && field.value.trim() === "") || (field.type === "number" && field.value === "")) {
        errors.push(`${field.name} is required`)
      }
    })

    // For advanced, validate that name is not empty.
    advancedFields.forEach((field, idx) => {
      if (field.name.trim() === "") {
        errors.push(`Advanced field #${idx + 1}: Name is required`)
      }
    })

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSave = () => {
    if (validateFields()) {
      // Combine both basic and advanced fields to update the node
      onUpdate({
        basic: basicFields,
        advanced: advancedFields,
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <Card className="w-[600px] max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{node.data.label || "Node"} Parameters</CardTitle>
              <CardDescription>Configure the parameters for this node</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">
                Basic Settings
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex-1">
                Advanced Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="overflow-y-auto flex-1">
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="basic" className="mt-0 space-y-4">
              {basicFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`basic-${index}`}>
                    {field.name}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  {field.type === "string" && (
                    <Input
                      id={`basic-${index}`}
                      value={field.value}
                      placeholder={`Enter ${field.name}`}
                      onChange={(e) => handleBasicChange(index, e.target.value)}
                    />
                  )}
                  {field.type === "number" && (
                    <Input
                      id={`basic-${index}`}
                      type="number"
                      value={field.value}
                      placeholder={`Enter ${field.name}`}
                      onChange={(e) => handleBasicChange(index, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="advanced" className="mt-0 space-y-4">
              <div className="max-h-[250px] overflow-y-auto space-y-4 pr-2">
                {advancedFields.map((field, index) => (
                  <div key={index} className="space-y-2 border p-2 rounded relative">
                    <div className="absolute top-2 right-2">
                      <Button variant="ghost" size="sm" onClick={() => removeAdvancedField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Label htmlFor={`adv-name-${index}`}>
                      Field Name<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id={`adv-name-${index}`}
                      value={field.name}
                      placeholder="e.g., userId"
                      onChange={(e) => handleAdvancedChange(index, "name", e.target.value)}
                    />
                    <Label htmlFor={`adv-type-${index}`}>Field Type</Label>
                    <Select value={field.type} onValueChange={(value) => handleAdvancedChange(index, "type", value)}>
                      <SelectTrigger id={`adv-type-${index}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={addAdvancedField}>
                Add Advanced Field
              </Button>
            </TabsContent>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Parameters</Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  )
}