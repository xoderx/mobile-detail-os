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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Live business performance and insights.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-8 px-4 text-brand-600 border-brand-200 bg-brand-50">Operational</Badge>
          <Badge variant="outline" className="h-8 px-4">System Live</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue?.toLocaleString() ?? '0.00'}</div>
            <p className="text-xs text-brand-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> Real-time tracking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.mrr?.toLocaleString() ?? '0.00'}</div>
            <p className="text-xs text-muted-foreground mt-1">Recurring Subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.subscriptionCount ?? '0'}</div>
            <p className="text-xs text-muted-foreground mt-1">Subscribed clients</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-500 text-white border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customer Sentiment</CardTitle>
            <Star className="h-4 w-4 text-brand-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.satisfactionScore ?? '4.9'}/5.0</div>
            <p className="text-xs text-brand-100 mt-1">Verified reviews</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--brand-500))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--brand-500))" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Connectivity Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <ShieldCheck className={`h-4 w-4 ${integrations.stripe ? 'text-emerald-500' : 'text-slate-300'}`} />
                  Stripe Gateway
                </div>
                <Badge variant={integrations.stripe ? 'secondary' : 'outline'} className="text-[10px]">
                  {integrations.stripe ? 'ACTIVE' : 'OFFLINE'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Zap className={`h-4 w-4 ${integrations.twilio ? 'text-amber-500' : 'text-slate-300'}`} />
                  Twilio Notifications
                </div>
                <Badge variant={integrations.twilio ? 'secondary' : 'outline'} className="text-[10px]">
                  {integrations.twilio ? 'ACTIVE' : 'DISABLED'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-2 border-t mt-4">
                <AlertCircle className="h-3 w-3" />
                <Link to="/admin/settings" className="hover:underline text-brand-600">Configure integrations in Settings</Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <Link to="/admin/schedule">Check Today's Route</Link>
              </Button>
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <Link to="/admin/customers">View Recent Leads</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}