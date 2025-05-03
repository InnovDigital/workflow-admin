"use client"

import React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

const DashboardLayout = ({ children }) => {
  return (
      <SidebarProvider>
        <div className="flex w-full h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-auto bg-white p-6">
            {children}
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
  )
}

export default DashboardLayout