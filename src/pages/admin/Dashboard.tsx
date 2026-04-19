import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Users as UsersIcon, Star, TrendingUp, ShieldCheck, Zap, Snowflake, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { BRAND_COLORS } from '@/lib/constants';
import { QuickCommandHub } from '@/components/admin/QuickCommandHub';
import { cn } from "@/lib/utils";
const chartData = [
  { name: 'Mon', revenue: 400 },
  { name: 'Tue', revenue: 600 },
  { name: 'Wed', revenue: 500 },
  { name: 'Thu', revenue: 900 },
  { name: 'Fri', revenue: 1200 },
  { name: 'Sat', revenue: 1500 },
  { name: 'Sun', revenue: 800 },
];
export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api<any>('/api/stats'),
  });
  const totalRevenue = stats?.totalRevenue ?? 0;
  const mrr = stats?.mrr ?? 0;
  const customerCount = stats?.customerCount ?? 0;
  const satisfactionScore = stats?.satisfactionScore ?? 5.0;
  const integrations = stats?.integrations ?? { stripe: false, twilio: false, googleMaps: false };
  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node-01 Active</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-shimmer leading-none">
            Fleet<br className="md:hidden" /> Intelligence
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-[9px] tracking-[0.3em] opacity-60">
            Real-time Operational Telemetry • Stone Cold OS
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Badge className="h-10 px-5 bg-primary/10 text-primary border-2 border-primary/20 font-black tracking-widest flex items-center gap-3 rounded-xl">
            <span className={cn("h-2 w-2 rounded-full bg-primary", !isLoading && "animate-ping")} />
            {isLoading ? 'SYNCING...' : 'LIVE TRANSMISSION'}
          </Badge>
          <Badge variant="outline" className="h-10 px-5 font-black border-2 text-[9px] uppercase tracking-widest rounded-xl bg-background/50">
            ENV: ARCTIC_PROD
          </Badge>
        </div>
      </div>
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Yield', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, meta: 'All-time platform yield', color: 'text-primary' },
          { label: 'Monthly MRR', value: `$${mrr.toLocaleString()}`, icon: TrendingUp, meta: 'Active Arctic Plans', color: 'text-primary' },
          { label: 'Fleet Registry', value: customerCount.toString(), icon: UsersIcon, meta: 'Unique Service Entities', color: 'text-secondary' },
        ].map((stat, i) => (
          <Card key={i} className="border-2 border-border/50 glass-ice rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform pointer-events-none">
              <stat.icon className="h-24 w-24" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} group-hover:animate-crackle`} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tighter">{isLoading ? '---' : stat.value}</div>
              <p className="text-[9px] text-muted-foreground mt-4 font-black uppercase tracking-widest opacity-60">
                {stat.meta}
              </p>
            </CardContent>
          </Card>
        ))}
        <Card className="bg-metallic text-white border-none shadow-[0_20px_50px_rgba(0,191,255,0.3)] rounded-[2.5rem] overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90">Arctic Rating</CardTitle>
            <Star className="h-4 w-4 text-white fill-white animate-crackle" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter">{isLoading ? '---' : `${satisfactionScore}/5.0`}</div>
            <p className="text-[10px] text-white/80 mt-4 font-black uppercase tracking-widest">Global Satisfaction Index</p>
          </CardContent>
        </Card>
      </div>
      {/* Quick Command Hub */}
      <QuickCommandHub />
      {/* Secondary Data Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-2 border-border/50 glass-ice rounded-[3rem] overflow-hidden shadow-sm">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Snowflake className="h-6 w-6 text-primary" />
              </div>
              Arctic Yield Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[450px] p-10 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_COLORS.primary} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={BRAND_COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.3)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} dy={15} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ stroke: BRAND_COLORS.primary, strokeWidth: 2 }}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.95)',
                    borderRadius: '24px',
                    border: '2px solid rgba(0,191,255,0.3)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  labelStyle={{ fontWeight: '900', textTransform: 'uppercase', color: BRAND_COLORS.primary, fontSize: '10px', marginBottom: '8px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={BRAND_COLORS.primary}
                  strokeWidth={6}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Deep Analysis & Integrity */}
        <div className="space-y-8">
          <Card className="border-2 border-border/50 glass-ice rounded-[2.5rem] p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Network Integrity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Arctic Ledger', icon: ShieldCheck, active: integrations.stripe, status: 'SECURE' },
                { label: 'Icy AI Engine', icon: Zap, active: integrations.twilio, status: 'ACTIVE' },
                { label: 'Spatial Node', icon: UsersIcon, active: integrations.googleMaps, status: 'SYNCED' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-white/5 transition-colors hover:bg-muted/30">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <item.icon className={cn("h-4 w-4", item.active ? "text-primary" : "text-muted-foreground/30")} />
                    {item.label}
                  </div>
                  <Badge variant={item.active ? "secondary" : "outline"} className="text-[8px] font-black px-2 h-5 flex items-center justify-center border-none">
                    {item.active ? item.status : 'OFFLINE'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] p-8 space-y-6">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                 <Zap className="h-4 w-4 text-primary" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Alert</span>
             </div>
             <p className="text-[11px] font-bold text-foreground/80 leading-relaxed uppercase">
               Next fleet renewal cycle begins in <span className="text-primary">48 hours</span>. Verify all technician protocols are up to date.
             </p>
             <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
               <div className={cn("h-full bg-primary", !isLoading && "animate-shimmer")} style={{ width: '75%' }} />
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}