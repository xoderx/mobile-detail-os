import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  CreditCard,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
function AppSidebar() {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", icon: Home, path: "/admin" },
    { label: "Schedule", icon: Calendar, path: "/admin/schedule" },
    { label: "Customers", icon: Users, path: "/admin/customers" },
    { label: "Subscriptions", icon: CreditCard, path: "/admin/subs" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">D</div>
          <span className="text-lg font-bold tracking-tight">DetailFlow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                  <Link to={item.path} className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path ? "bg-brand-50 text-brand-600" : "hover:bg-accent"
                  )}>
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
        <SidebarMenuButton className="w-full text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
};
export function AppLayout({ children, container = false }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-16 items-center border-b px-4 md:px-6">
          <SidebarTrigger />
          <div className="ml-4 h-4 w-px bg-border" />
          <h1 className="ml-4 text-sm font-medium text-muted-foreground">Admin Portal</h1>
        </div>
        {container ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        ) : (
          children
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}