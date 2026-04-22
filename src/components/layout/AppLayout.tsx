import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Calendar,
  Users,
  Settings,
  CreditCard,
  LogOut,
  LayoutDashboard,
  UserCog,
  MessageSquare
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
import { LOGO_BASE64, BRAND_SHORT_NAME } from "@/lib/constants";
import { Logo } from '@/components/Logo';
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
    { label: "Review Center", icon: MessageSquare, path: "/admin/reviews" },
    { label: "System Control", icon: Settings, path: "/admin/settings" },
  ];
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <Sidebar className="border-r-2 border-sidebar-border/50 bg-sidebar/50 backdrop-blur-md">
      <SidebarHeader className="p-8">
        <div className="flex items-center gap-3">
          <Logo className="h-12 w-12 animate-shimmer" alt={BRAND_SHORT_NAME} />
          <span className="text-xl font-black tracking-tighter uppercase text-shimmer">{BRAND_SHORT_NAME}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <SidebarMenuItem key={item.path} className="mb-2">
                  <SidebarMenuButton asChild isActive={isActive} className="h-12 px-4 rounded-xl">
                    <Link to={item.path} className={cn(
                      "flex items-center gap-4 transition-all duration-300",
                      isActive
                        ? "bg-primary/10 text-primary border-2 border-primary/20 shadow-[0_0_15px_rgba(30,144,255,0.15)]"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-2 border-transparent"
                    )}>
                      <item.icon className={cn("h-5 w-5", isActive && "animate-crackle")} />
                      <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-8 border-t-2 border-border/50">
        <div className="mb-8 p-5 rounded-3xl glass-ice border-2 border-primary/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20 border border-white/20">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-tight truncate max-w-[120px]">{user?.name || 'Admin'}</span>
              <Badge className="text-[8px] h-4 px-2 uppercase bg-secondary text-secondary-foreground font-black border-none w-fit mt-1">
                {user?.role || 'User'}
              </Badge>
            </div>
          </div>
        </div>
        <SidebarMenuButton onClick={handleLogout} className="w-full h-12 text-muted-foreground hover:text-destructive transition-colors font-black uppercase text-[10px] tracking-widest border-2 border-transparent hover:border-destructive/20 rounded-xl">
          <LogOut className="h-4 w-4 mr-3" />
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
        <header className="flex h-16 items-center border-b-2 border-border/50 px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <SidebarTrigger />
          <div className="ml-8 h-6 w-px bg-border/50" />
          <div className="ml-8 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">System Command</span>
            <span className="text-xs text-muted-foreground opacity-30">/</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Operational Node</span>
          </div>
        </header>
        <main className={cn(
          "w-full",
          container && "max-w-7xl mx-auto px-8 py-12"
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}