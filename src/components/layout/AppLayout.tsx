import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Calendar,
  Users,
  Settings,
  CreditCard,
  LogOut,
  LayoutDashboard,
  UserCog
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABNmlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjarY7NDkBAFIWnL6UoWfFndm7szm9jY2f9XIsomfU6Oje85fSce78AIEZTo8HWBGfFzPImRkdXV6pG9AByDAm50rUe1yV8FshWAsmYq9v1U2A2mD8tYFpZ/6y/668pXUv6LNAshZJx67vAaiB/XMC0sv6OvxPshSREvGReSjr6vAtshLREvGRedLzI95AdEJYIH5kvOT/kfMhOxEvGRS5X6M6M+AaxH8IKscAUEC30L6I/hBXigYknWuhfRH8IK8QDE0+00L+I/hBWiwZ6p+u8AOKF/UX0h7BOPLD3RAv9S+9A+vK76H5X96B7L3XvX+X65f6N7o8Y+P4IAAAAOGVYSWZNTQAqAAAACAAHAQYAAwAAAAEAAQAAAREABAAAAAEAAABAAREQAEAAAAAEAAAAUAAAAABBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykAAAADAAAABwAAAAEAAA== ";
function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/admin" },
    { label: "Arctic Schedule", icon: Calendar, path: "/admin/schedule" },
    { label: "Client Database", icon: Users, path: "/admin/customers" },
    { label: "Team Management", icon: UserCog, path: "/admin/users" },
    { label: "Subscriptions", icon: CreditCard, path: "/admin/subs" },
    { label: "System Control", icon: Settings, path: "/admin/settings" },
  ];
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <Sidebar className="border-r border-sidebar-border/50 bg-sidebar/50 backdrop-blur-md">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <img src={LOGO_BASE64} alt="Stone Cold" className="h-8 w-8 animate-shimmer" />
          <span className="text-lg font-black tracking-tighter uppercase text-shimmer">Stone Cold</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <SidebarMenuItem key={item.path} className="mb-1">
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link to={item.path} className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(30,144,255,0.1)]" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}>
                      <item.icon className={cn("h-4 w-4", isActive && "animate-crackle")} />
                      <span className="font-bold text-sm">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t border-border/50">
        <div className="mb-6 p-4 rounded-2xl glass-ice border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-[10px]">
              {user?.name?.[0] || 'A'}
            </div>
            <span className="text-sm font-bold truncate">{user?.name || 'Admin'}</span>
          </div>
          <Badge className="text-[9px] h-4 px-2 uppercase bg-secondary text-secondary-foreground font-black border-none">
            {user?.role || 'User'}
          </Badge>
        </div>
        <SidebarMenuButton onClick={handleLogout} className="w-full text-muted-foreground hover:text-destructive transition-colors font-bold">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Eject Session</span>
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
      <SidebarInset className="bg-background">
        <header className="flex h-16 items-center border-b border-border/50 px-6 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <SidebarTrigger />
          <div className="ml-6 h-6 w-px bg-border/50" />
          <div className="ml-6 flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary/60">System Operations</span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-bold text-muted-foreground">Admin Command</span>
          </div>
        </header>
        <main className={cn(
          "w-full",
          container && "max-w-7xl mx-auto px-6 py-12"
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}