"use client"

import * as React from "react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import * as Icons from "lucide-react";

export const sidebarLinks = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Icons.LayoutDashboard, // Use Lucide icon
    isActive: true,
  },
  {
    title: "Main Projects",
    url: "/projects",
    icon: Icons.Folder, // Use Lucide icon
    isActive: false,
  },
  {
    title: "Create Design",
    url: "/designs",
    icon: Icons.PenTool, // Use Lucide icon
    isActive: false,
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: Icons.CreditCard, // Use Lucide icon
    isActive: false,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Icons.Settings,
    isActive: false,
  },
  {
    title: "Homepage",
    url: "/",
    icon: Icons.Home,
    isActive: false,
  },
  {
    title: "Support",
    url: "#",
    icon: Icons.MessageCircle,
    isActive: false,
  },
];



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        StructIQ
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarLinks} />
        <NavProjects projects={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={[]} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
