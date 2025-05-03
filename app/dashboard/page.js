"use client"

import React, { useState } from "react"
import { PageHeader } from "@/components/overview/project-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  PlusCircle,
  FileText,
  PlayCircle,
  AlertTriangle,
} from "lucide-react"
import { ProjectList } from "@/components/overview/project-list"

export default function DashboardOverView() {
  const [stats] = useState([
    {
      title: "Total Projects",
      value: 18,
      diff: "+3 from last month",
      icon: FileText,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Workflows",
      value: 12,
      diff: "+2 from last month",
      icon: PlayCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Validation",
      value: 3,
      diff: "-1 from last month",
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ])
  const [currentTab, setCurrentTab] = useState("active")

  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="HR Workflow Automation"
        description="Manage and automate your HR document workflows"
        action={
          <Button
            asChild
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href="/dashboard/projects/create" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map(
          ({ title, value, diff, icon: Icon, iconBg, iconColor }) => (
            <Card key={title}>
              <CardHeader className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`${iconBg} ${iconColor} p-1 rounded-full h-6 w-6`}
                  />
                  <CardTitle className={`text-sm font-medium ${iconColor}`}>
                    {title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{diff}</p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="validation">Needs Validation</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
           <ProjectList status="active" />
        </TabsContent>
        <TabsContent value="draft">
          <ProjectList status="draft" /> 
        </TabsContent>
        <TabsContent value="validation">
          <ProjectList status="validation" /> 
        </TabsContent>
      </Tabs>
    </div>
  )
}