import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  User as UserIcon,
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

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Schedule", icon: Calendar, path: "/admin/schedule" },
    { label: "Customers", icon: Users, path: "/admin/customers" },
    { label: "Team & Users", icon: UserCog, path: "/admin/users" },
    { label: "Subscriptions", icon: CreditCard, path: "/admin/subs" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">DX</div>
          <span className="text-lg font-bold tracking-tight">Detail Deluxe</span>
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
        <div className="mb-4 px-2 py-3 rounded-lg bg-muted/30 border">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-full bg-brand-500 flex items-center justify-center text-[10px] text-white font-bold">
              {user?.name?.[0] || 'A'}
            </div>
            <span className="text-xs font-bold truncate">{user?.name || 'Admin'}</span>
          </div>
          <Badge className="text-[9px] h-4 px-1.5 uppercase bg-brand-100 text-brand-700 hover:bg-brand-100 border-none">
            {user?.role || 'User'}
          </Badge>
        </div>
        <SidebarMenuButton onClick={handleLogout} className="w-full text-muted-foreground hover:text-foreground">
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
      <SidebarInset className="bg-slate-50/50">
        <div className="flex h-16 items-center border-b px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <SidebarTrigger />
          <div className="ml-4 h-4 w-px bg-border" />
          <h1 className="ml-4 text-sm font-medium text-muted-foreground">Admin Portal</h1>
        </div>
        {container ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
            {children}
          </div>
        ) : (
          <div className="w-full">
            {children}
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}