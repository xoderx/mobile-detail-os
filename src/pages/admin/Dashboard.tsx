import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users as UsersIcon, ArrowUpRight, Star, TrendingUp, ShieldCheck, Zap, AlertCircle, Snowflake } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { BRAND_COLORS } from '@/lib/constants';
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
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api<any>('/api/stats'),
  });
  const integrations = stats?.integrations ?? { stripe: false, twilio: false, googleMaps: false };
  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center px-2 md:px-0">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-shimmer">Fleet Intelligence</h1>
          <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest mt-1 opacity-70">Real-time performance metrics: Stone Cold Detailing</p>
        </div>
        <div className="flex gap-3">
          <Badge className="h-9 px-4 bg-primary/10 text-primary border-2 border-primary/20 font-black tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            LIVE OPS
          </Badge>
          <Badge variant="outline" className="h-9 px-4 font-black border-2 text-[10px] uppercase tracking-widest">STATE: ARCTIC</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Yield', value: `$${stats?.totalRevenue?.toLocaleString() ?? '0'}`, icon: DollarSign, meta: 'All-time yield', color: 'text-primary' },
          { label: 'Monthly MRR', value: `$${stats?.mrr?.toLocaleString() ?? '0'}`, icon: TrendingUp, meta: 'Active Arctic Plans', color: 'text-primary' },
          { label: 'Fleet Registry', value: stats?.customerCount ?? '0', icon: UsersIcon, meta: 'Unique Entities', color: 'text-secondary' },
        ].map((stat, i) => (
          <Card key={i} className="border-2 border-border/50 glass-ice rounded-[2rem] shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight">{stat.value}</div>
              <p className="text-[9px] text-muted-foreground mt-3 font-black uppercase tracking-widest opacity-60">
                {stat.meta}
              </p>
            </CardContent>
          </Card>
        ))}
        <Card className="bg-metallic text-white border-none shadow-[0_10px_40px_rgba(30,144,255,0.25)] rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90">Arctic Rating</CardTitle>
            <Star className="h-4 w-4 text-white fill-white animate-crackle" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{stats?.satisfactionScore ?? '4.9'}/5.0</div>
            <p className="text-[10px] text-white/80 mt-3 font-black uppercase tracking-wider">Global Satisfaction Index</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-2 border-border/50 glass-ice rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
              <Snowflake className="h-5 w-5 text-primary" />
              Arctic Yield Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] p-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={BRAND_COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.3)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: '20px', border: '2px solid rgba(0,191,255,0.2)', backdropFilter: 'blur(12px)' }}
                  labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', color: BRAND_COLORS.primary, fontSize: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={BRAND_COLORS.primary}
                  strokeWidth={5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-2 border-border/50 glass-ice rounded-[2rem]">
            <CardHeader className="pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Network Integrity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: 'Arctic Ledger', icon: ShieldCheck, active: integrations.stripe, status: 'SECURE' },
                { label: 'Icy AI Engine', icon: Zap, active: integrations.twilio, status: 'ACTIVE' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <item.icon className={`h-4 w-4 ${item.active ? 'text-primary' : 'text-muted'}`} />
                    {item.label}
                  </div>
                  <Badge variant={item.active ? 'secondary' : 'outline'} className="text-[8px] font-black px-2">
                    {item.active ? item.status : 'IDLE'}
                  </Badge>
                </div>
              ))}
              <div className="pt-4">
                <Button variant="outline" size="sm" className="w-full h-12 border-2 font-black text-[10px] tracking-widest uppercase rounded-xl hover:bg-primary/5 transition-colors" asChild>
                  <Link to="/admin/settings">Sync Global Nodes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4">
            <Button variant="default" size="lg" className="h-16 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform" asChild>
              <Link to="/admin/schedule">Launch Dispatch</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 rounded-2xl border-2 font-black uppercase text-xs tracking-widest hover:bg-muted/50" asChild>
              <Link to="/admin/users">Auth Manager</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}