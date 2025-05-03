"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  FileText,
  Home,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
  const pathname = usePathname()
  const isActive = (path) =>
    pathname === path || pathname?.startsWith(path + "/")

  const linkClass = (path) =>
    `flex items-center gap-2 ${
      isActive(path) ? "text-blue-600" : "text-black"
    }`

  return (
    <Sidebar className="w-64 border-r border-gray-200 bg-white">
      <SidebarHeader className="px-4 py-3 flex flex-row gap-2 items-center">
        <FileText className="h-6 w-6 text-blue-600" />
        <span className="ml-2 text-lg font-semibold text-blue-600">
          Wego Workflow
        </span>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link href="/dashboard" className={linkClass("/")}>
                    <Home />
                    <span>OverView</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/projects")}
                >
                  <Link href="/dashboard/projects" className={linkClass("/dashboard/projects")}>
                    <CalendarDays />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/documents")}
                >
                  <Link href="/dashboard/documents" className={linkClass("/dashboard/documents")}>
                    <CalendarDays />
                    <span>Documents</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/settings")}
                >
                  <Link href="/dashboard/settings" className={linkClass("/dashboard/settings")}>
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>WW</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-black">Admin User</p>
              <p className="text-xs text-gray-500">admin@wego.com</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}