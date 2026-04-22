import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users as UsersIcon, ArrowUpRight, Star, TrendingUp, ShieldCheck, Zap, AlertCircle, Snowflake } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
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
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-shimmer">Fleet Intelligence</h1>
          <p className="text-muted-foreground font-medium mt-1">Real-time performance metrics for Stone Cold Detailing.</p>
        </div>
        <div className="flex gap-3">
          <Badge className="h-9 px-4 bg-primary/10 text-primary border border-primary/20 font-black tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            LIVE FLIGHT OPS
          </Badge>
          <Badge variant="outline" className="h-9 px-4 font-bold border-2">SYSTEM: FROZEN</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none glass-ice rounded-[1.5rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">${stats?.totalRevenue?.toLocaleString() ?? '0'}</div>
            <p className="text-[10px] text-emerald-500 flex items-center mt-3 font-black uppercase tracking-wider">
              <ArrowUpRight className="h-3 w-3 mr-1" /> All-time yield
            </p>
          </CardContent>
        </Card>
        <Card className="border-none glass-ice rounded-[1.5rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Monthly MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary animate-crackle" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">${stats?.mrr?.toLocaleString() ?? '0'}</div>
            <p className="text-[10px] text-muted-foreground mt-3 font-bold uppercase tracking-wider">Active Arctic Plans</p>
          </CardContent>
        </Card>
        <Card className="border-none glass-ice rounded-[1.5rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Unique Clients</CardTitle>
            <UsersIcon className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{stats?.customerCount ?? '0'}</div>
            <p className="text-[10px] text-muted-foreground mt-3 font-bold uppercase tracking-wider">Fleet Registry</p>
          </CardContent>
        </Card>
        <Card className="bg-metallic text-white border-none shadow-[0_10px_40px_rgba(30,144,255,0.25)] rounded-[1.5rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90">Arctic Rating</CardTitle>
            <Star className="h-4 w-4 text-white fill-white animate-crackle" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{stats?.satisfactionScore ?? '4.9'}/5.0</div>
            <p className="text-[10px] text-white/80 mt-3 font-black uppercase tracking-wider">Global Satisfaction</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-none glass-ice rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
              <Snowflake className="h-4 w-4 text-primary" />
              Arctic Yield Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] pr-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1E90FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.2)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                  labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', color: '#1E90FF', fontSize: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1E90FF"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-none glass-ice rounded-[1.5rem]">
            <CardHeader className="pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Network Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <ShieldCheck className={`h-5 w-5 ${integrations.stripe ? 'text-emerald-500' : 'text-muted'}`} />
                  Arctic Ledger
                </div>
                <Badge variant={integrations.stripe ? 'secondary' : 'outline'} className="text-[9px] font-black px-2">
                  {integrations.stripe ? 'SECURE' : 'OFFLINE'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <Zap className={`h-5 w-5 ${integrations.twilio ? 'text-primary' : 'text-muted'}`} />
                  Icy AI Engine
                </div>
                <Badge variant={integrations.twilio ? 'secondary' : 'outline'} className="text-[9px] font-black px-2">
                  {integrations.twilio ? 'ACTIVE' : 'IDLE'}
                </Badge>
              </div>
              <div className="pt-6 border-t border-border/50">
                <Button variant="outline" size="sm" className="w-full h-11 border-2 font-black text-[10px] tracking-widest uppercase rounded-xl" asChild>
                  <Link to="/admin/settings">Sync Global Nodes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none bg-primary/5 rounded-[1.5rem] border-2 border-primary/10">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Rapid Action</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <Button variant="default" size="sm" className="justify-start h-12 rounded-xl bg-primary text-white font-black uppercase text-[10px] tracking-widest" asChild>
                <Link to="/admin/schedule">Launch Dispatch</Link>
              </Button>
              <Button variant="outline" size="sm" className="justify-start h-12 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest" asChild>
                <Link to="/admin/users">Auth Manager</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}