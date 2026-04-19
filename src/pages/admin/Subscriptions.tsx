import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp, Users, RefreshCw } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage recurring revenue and membership tiers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${statsData?.mrr?.toLocaleString() ?? '0'}</div>
              <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
              <Users className="h-4 w-4 text-brand-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData?.subscriptionCount ?? '0'}</div>
              <p className="text-xs text-muted-foreground mt-1">94% retention rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <RefreshCw className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4%</div>
              <p className="text-xs text-muted-foreground mt-1">Low churn performance</p>
            </CardContent>
          </Card>
        </div>
        <div className="border rounded-xl bg-background shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Subscriber</TableHead>
                <TableHead className="font-bold">Plan</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Next Renewal</TableHead>
                <TableHead className="font-bold">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10">Loading subscribers...</TableCell></TableRow>
              ) : subs.length > 0 ? (
                subs.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">Customer {sub.customerId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{sub.planType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={sub.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(sub.nextRenewal), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="font-bold">${sub.price}/mo</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-10">No active subscriptions found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}