import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, RefreshCw, Plus, CreditCard } from 'lucide-react';
import { format, isAfter } from 'date-fns';
export default function MyBookings() {
  const user = useAuthStore(s => s.user);
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['my-bookings', user?.id],
    queryFn: () => api<{ items: any[] }>(`/api/bookings?customerId=${user?.id}`),
    enabled: !!user?.id,
  });
  const { data: subsData } = useQuery({
    queryKey: ['my-subscriptions', user?.id],
    queryFn: () => api<{ items: any[] }>(`/api/subscriptions`), // Simplified for demo
    enabled: !!user?.id,
  });
  const bookings = bookingsData?.items ?? [];
  const upcoming = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const past = bookings.filter(b => b.status === 'completed');
  const mySub = subsData?.items?.[0];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Portal</h1>
            <p className="text-muted-foreground">Manage your services and vehicle health.</p>
          </div>
          <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600">
            <Link to="/booking"><Plus className="h-4 w-4 mr-2" /> Book New Detail</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-500" />
                Upcoming Services
              </h2>
              {upcoming.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {upcoming.map((b) => (
                    <Card key={b.id} className="border-l-4 border-l-brand-500 overflow-hidden shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-brand-50 text-brand-700 hover:bg-brand-50 border-brand-200">
                                {format(new Date(b.dateTime), 'MMM d, h:mm a')}
                              </Badge>
                              <Badge variant="outline" className="capitalize">{b.status}</Badge>
                            </div>
                            <h3 className="text-lg font-bold capitalize">{b.packageId} Treatment</h3>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.vehicleSize}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Mobile Service</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm">Reschedule</Button>
                             <Button variant="ghost" size="sm" className="text-destructive">Cancel</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed rounded-2xl text-center bg-muted/20">
                  <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
                </div>
              )}
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-5 w-5" />
                Service History
              </h2>
              <div className="space-y-3">
                {past.length > 0 ? (
                  past.map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-4 border rounded-xl bg-background hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="text-sm font-bold capitalize">{b.packageId} Detail</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(b.dateTime), 'PP')}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-brand-600">${b.totalPrice}</div>
                        <Badge variant="secondary" className="text-[10px]">COMPLETED</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Your service history will appear here.</p>
                )}
              </div>
            </section>
          </div>
          <div className="space-y-6">
            <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Membership Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {mySub ? (
                  <>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold capitalize">{mySub.planType} Plan</div>
                      <p className="text-slate-400 text-xs">Active since {format(Date.now() - 1000000000, 'MMM yyyy')}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Next Renewal</span>
                        <span className="font-bold">{format(new Date(mySub.nextRenewal), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-4 space-y-4">
                    <p className="text-sm text-slate-400">Join a monthly plan to save 20% on every service.</p>
                    <Button className="w-full bg-brand-500 hover:bg-brand-600">View Plans</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-brand-100 bg-brand-50/50">
              <CardHeader>
                <CardTitle className="text-sm text-brand-900">Refer a Friend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-brand-800 mb-4">Give $20, get $20. Share your unique code with friends and family.</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-brand-200 rounded px-3 py-2 text-xs font-mono font-bold text-brand-600">DF-CLIENT-{user?.id?.slice(0, 4)}</div>
                  <Button size="sm" variant="outline">Copy</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}