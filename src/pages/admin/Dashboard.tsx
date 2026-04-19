import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users as UsersIcon, ArrowUpRight, Star, TrendingUp, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Overview</h1>
          <p className="text-muted-foreground">Real-time performance metrics for Detail Deluxe.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-8 px-4 text-brand-600 border-brand-200 bg-brand-50 font-bold">LIVE OPS</Badge>
          <Badge variant="outline" className="h-8 px-4 font-medium">SYSTEM STABLE</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats?.totalRevenue?.toLocaleString() ?? '0'}</div>
            <p className="text-xs text-brand-600 flex items-center mt-2 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> All-time completed
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats?.mrr?.toLocaleString() ?? '0'}</div>
            <p className="text-xs text-muted-foreground mt-2">Active Subscriptions</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Clients</CardTitle>
            <UsersIcon className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.customerCount ?? '0'}</div>
            <p className="text-xs text-muted-foreground mt-2">Unique profiles</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-500 text-white border-none shadow-lg shadow-brand-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-brand-100 fill-brand-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.satisfactionScore ?? '4.9'}/5.0</div>
            <p className="text-xs text-brand-100 mt-2 font-medium">Global Rating</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.5)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Connectivity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <ShieldCheck className={`h-4 w-4 ${integrations.stripe ? 'text-emerald-500' : 'text-slate-300'}`} />
                  Stripe Gateway
                </div>
                <Badge variant={integrations.stripe ? 'secondary' : 'outline'} className="text-[10px] h-5 px-1.5 font-bold">
                  {integrations.stripe ? 'ACTIVE' : 'OFFLINE'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Zap className={`h-4 w-4 ${integrations.twilio ? 'text-amber-500' : 'text-slate-300'}`} />
                  Cloudflare AI
                </div>
                <Badge variant={integrations.twilio ? 'secondary' : 'outline'} className="text-[10px] h-5 px-1.5 font-bold">
                  {integrations.twilio ? 'ACTIVE' : 'DISABLED'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-4 border-t mt-4">
                <AlertCircle className="h-3 w-3" />
                <Link to="/admin/settings" className="hover:underline text-brand-600 font-bold">Configure System Nodes</Link>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Button variant="outline" size="sm" className="justify-start h-10 rounded-xl bg-background" asChild>
                <Link to="/admin/schedule">View Dispatch Queue</Link>
              </Button>
              <Button variant="outline" size="sm" className="justify-start h-10 rounded-xl bg-background" asChild>
                <Link to="/admin/users">Manage Access</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}