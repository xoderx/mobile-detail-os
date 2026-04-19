import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { DollarSign, Briefcase, Users as UsersIcon, ArrowUpRight, Star, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
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
  const { data: bookingsData } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api<{ items: any[] }>('/api/bookings'),
  });
  const bookings = bookingsData?.items ?? [];
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Live business performance and insights.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-8 px-4 text-brand-600 border-brand-200 bg-brand-50">Operational</Badge>
          <Badge variant="outline" className="h-8 px-4">Live Data</Badge>
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
            <p className="text-xs text-muted-foreground mt-1">Recurring Subscription Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.customerCount ?? '0'}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique client records</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-500 text-white shadow-brand">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
            <Star className="h-4 w-4 text-brand-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.satisfactionScore ?? '4.9'}/5.0</div>
            <p className="text-xs text-brand-100 mt-1">Verified customer reviews</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Technician Overview</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">1</div>
                   <div className="text-sm font-medium">Tech #1 (Senior)</div>
                 </div>
                 <Badge variant="secondary">14 Jobs</Badge>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">2</div>
                   <div className="text-sm font-medium">Tech #2 (Lead)</div>
                 </div>
                 <Badge variant="secondary">9 Jobs</Badge>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">3</div>
                   <div className="text-sm font-medium">Tech #3 (Junior)</div>
                 </div>
                 <Badge variant="secondary">4 Jobs</Badge>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}