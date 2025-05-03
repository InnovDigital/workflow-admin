"use client"

import { Clock, FileText, MoreHorizontal, PlayCircle, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Mock data for projects
const mockProjects = {
  active: [
    {
      id: "1",
      name: "Employee Onboarding",
      description: "New employee document processing workflow",
      status: "active",
      lastUpdated: "2 days ago",
      department: "HR",
      nodeCount: 12,
    },
    {
      id: "2",
      name: "Leave Request Approval",
      description: "Automated leave request processing",
      status: "active",
      lastUpdated: "5 days ago",
      department: "HR",
      nodeCount: 8,
    },
    {
      id: "3",
      name: "Performance Review",
      description: "Annual performance review document flow",
      status: "active",
      lastUpdated: "1 week ago",
      department: "HR",
      nodeCount: 15,
    },
  ],
  draft: [
    {
      id: "4",
      name: "Training Certificate Generation",
      description: "Generate certificates after training completion",
      status: "draft",
      lastUpdated: "1 day ago",
      department: "Training",
      nodeCount: 6,
    },
    {
      id: "5",
      name: "Expense Reimbursement",
      description: "Process expense reports and reimbursements",
      status: "draft",
      lastUpdated: "3 days ago",
      department: "Finance",
      nodeCount: 9,
    },
  ],
  validation: [
    {
      id: "6",
      name: "Offboarding Process",
      description: "Employee exit document processing",
      status: "validation",
      lastUpdated: "2 days ago",
      department: "HR",
      nodeCount: 10,
    },
    {
      id: "7",
      name: "Salary Revision",
      description: "Annual salary revision workflow",
      status: "validation",
      lastUpdated: "4 days ago",
      department: "Finance",
      nodeCount: 7,
    },
    {
      id: "8",
      name: "Remote Work Request",
      description: "Process remote work applications",
      status: "validation",
      lastUpdated: "1 week ago",
      department: "HR",
      nodeCount: 5,
    },
  ],
}

export function ProjectList({ status }) {
  const projects = mockProjects[status]

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "validation":
        return <Badge className="bg-yellow-500">Needs Validation</Badge>
      case "draft":
        return <Badge className="bg-gray-500">Draft</Badge>
      default:
        return null
    }
  }

  const getPrimaryAction = (project) => {
    switch (project.status) {
      case "active":
        return (
          <Button
            size="sm"
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href={`/projects/${project.id}`}>View Workflow</Link>
          </Button>
        )
      case "validation":
        return (
          <Button
            size="sm"
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href={`/projects/${project.id}/validate`}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Validate
            </Link>
          </Button>
        )
      case "draft":
        return (
          <Button size="sm" variant="outline" asChild>
            <Link href={`/projects/${project.id}/edit`}>Continue Editing</Link>
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">
                {project.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/projects/${project.id}`}>View Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/projects/${project.id}/duplicate`}>
                      Duplicate
                    </Link>
                  </DropdownMenuItem>
                  {project.status !== "active" && (
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${project.id}/delete`}>Delete</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <span>Department: {project.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              <span>{project.nodeCount} nodes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated {project.lastUpdated}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t bg-muted/30">
            {getStatusBadge(project.status)}
            {getPrimaryAction(project)}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
