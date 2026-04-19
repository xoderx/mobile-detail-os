import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp, Users, RefreshCw, Star } from 'lucide-react';
import { format } from 'date-fns';
export default function Subscriptions() {
  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api<any>('/api/stats'),
  });
  const { data: subsData, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => api<{ items: any[] }>('/api/subscriptions'),
  });
  const subs = subsData?.items ?? [];
  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage memberships and recurring detailing cycles.</p>
        </div>
        <Badge className="bg-brand-500 py-1.5 px-4 uppercase text-[10px] font-bold tracking-widest shadow-lg shadow-brand-500/20">
          MRR Tracking Live
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Monthly MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${statsData?.mrr?.toLocaleString() ?? '0'}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-2">
              +12.5% <span className="text-muted-foreground font-normal ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Members</CardTitle>
            <Users className="h-4 w-4 text-brand-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData?.subscriptionCount ?? '0'}</div>
            <p className="text-xs text-muted-foreground mt-2">Retention: 96.2%</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Churn Rate</CardTitle>
            <RefreshCw className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.8%</div>
            <p className="text-xs text-amber-600 font-medium mt-2">Industry Low</p>
          </CardContent>
        </Card>
      </div>
      <div className="border rounded-2xl bg-background shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/10 flex items-center justify-between">
          <h3 className="font-bold">Active Memberships</h3>
          <Badge variant="outline" className="bg-white">Next Renewal: Tomorrow</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-none">
                <TableHead className="font-bold py-4">Subscriber</TableHead>
                <TableHead className="font-bold">Membership Tier</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Next Billing</TableHead>
                <TableHead className="font-bold text-right pr-8">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20">Syncing subscription records...</TableCell></TableRow>
              ) : subs.length > 0 ? (
                subs.map((sub) => (
                  <TableRow key={sub.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium flex items-center gap-3 py-4">
                      <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center"><CreditCard className="h-4 w-4 text-slate-400" /></div>
                      Client ID: {sub.customerId.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className={`h-3 w-3 ${sub.planType === 'premium' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                        <Badge variant="outline" className="capitalize font-bold border-brand-100 text-brand-700 bg-brand-50/30">{sub.planType}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={sub.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-400'}>
                        {sub.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {format(new Date(sub.nextRenewal), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="font-bold text-right pr-8">${sub.price}<span className="text-[10px] text-muted-foreground font-normal">/mo</span></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">No recurring memberships active.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}