import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "/projects",
        icon: "projects",
        title: "Projects",
      },
      {
        href: "/designs",
        icon: "designs",
        title: "Designs",
      },
      {
        href: "/managers",
        icon: "managers",
        title: "Managers",
      },
      {
        href: "/reports",
        icon: "reports",
        title: "Reports",
      },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
      },
 
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
      },
    ],
  },
];
