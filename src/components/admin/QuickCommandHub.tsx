import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Settings, 
  UserCog, 
  Home, 
  Tag, 
  PlusCircle, 
  UserPlus, 
  LogIn, 
  MessageSquare, 
  Mail, 
  ExternalLink,
  Shield,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface CommandItem {
  label: string;
  icon: React.ElementType;
  path: string;
  description: string;
  color: string;
}
interface CommandGroup {
  title: string;
  items: CommandItem[];
}
const COMMAND_GROUPS: CommandGroup[] = [
  {
    title: "Operations",
    items: [
      { label: "Dispatch", icon: Calendar, path: "/admin/schedule", description: "Manage technician routes", color: "text-primary" },
      { label: "Clients", icon: Users, path: "/admin/customers", description: "Customer database & LTV", color: "text-blue-500" },
      { label: "Team", icon: UserCog, path: "/admin/users", description: "Manage technician access", color: "text-indigo-500" },
      { label: "Fleet Log", icon: LayoutDashboard, path: "/admin", description: "System wide activity", color: "text-slate-400" },
    ]
  },
  {
    title: "Business",
    items: [
      { label: "Subscriptions", icon: CreditCard, path: "/admin/subs", description: "MRR & recurring plans", color: "text-emerald-500" },
      { label: "System", icon: Settings, path: "/admin/settings", description: "Global configuration", color: "text-amber-500" },
      { label: "CMS", icon: Zap, path: "/admin/settings", description: "Brand & content control", color: "text-purple-500" },
      { label: "Security", icon: Shield, path: "/admin/settings", description: "Hardening & access logs", color: "text-rose-500" },
    ]
  },
  {
    title: "Public Experience",
    items: [
      { label: "Landing", icon: Home, path: "/", description: "Public storefront", color: "text-primary" },
      { label: "Pricing", icon: Tag, path: "/pricing", description: "Tier management view", color: "text-sky-400" },
      { label: "Wizard", icon: PlusCircle, path: "/booking", description: "Booking flow test", color: "text-cyan-500" },
      { label: "Feedback", icon: MessageSquare, path: "/", description: "User satisfaction node", color: "text-teal-500" },
    ]
  },
  {
    title: "Access Nodes",
    items: [
      { label: "Registration", icon: UserPlus, path: "/signup", description: "New member vault portal", color: "text-blue-400" },
      { label: "Login", icon: LogIn, path: "/login", description: "General authentication", color: "text-slate-400" },
      { label: "Admin Auth", icon: Shield, path: "/admin/login", description: "System entry point", color: "text-red-500" },
      { label: "Newsletters", icon: Mail, path: "/admin/settings", description: "Lead capture archive", color: "text-orange-400" },
    ]
  }
];
export function QuickCommandHub() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Unified Command Hub</h2>
      </div>
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMMAND_GROUPS.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">{group.title}</h3>
              <div className="grid grid-cols-2 gap-3">
                {group.items.map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-border/40",
                          "glass-ice hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden"
                        )}
                      >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <item.icon className={cn("h-5 w-5 mb-2 transition-transform group-hover:scale-110", item.color)} />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-foreground/80 group-hover:text-primary transition-colors text-center">
                          {item.label}
                        </span>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-30 transition-opacity">
                          <ExternalLink className="h-2 w-2" />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-950 border-primary/20 text-[9px] font-black uppercase tracking-widest p-2 px-3">
                      {item.description}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}