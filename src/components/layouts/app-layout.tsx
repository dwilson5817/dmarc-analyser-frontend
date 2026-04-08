import { Outlet } from "react-router"
import { AppSidebar } from "@/components/app-sidebar.tsx"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx"
import { SiteHeader } from "@/components/site-header.tsx"

export const AppLayout = () => (
  <SidebarProvider
    style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }
  >
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <Outlet />
    </SidebarInset>
  </SidebarProvider>
)
