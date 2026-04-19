import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, RefreshCw, Plus, CreditCard, User } from 'lucide-react';
import { format } from 'date-fns';
import { Logo } from '@/components/Logo';
import { BRAND_NAME } from '@/lib/constants';
import { ThemeToggle } from '@/components/ThemeToggle';
export default function MyBookings() {
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['my-bookings', user?.id],
    queryFn: () => api<{ items: any[] }>(`/api/bookings?customerId=${user?.id}`),
    enabled: !!user?.id,
  });
  const { data: subsData } = useQuery({
    queryKey: ['my-subscriptions', user?.id],
    queryFn: () => api<{ items: any[] }>(`/api/subscriptions`), 
    enabled: !!user?.id,
  });
  const bookings = bookingsData?.items ?? [];
  const upcoming = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const past = bookings.filter(b => b.status === 'completed');
  const mySub = subsData?.items?.[0];
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="text-sm font-black tracking-tighter uppercase">{BRAND_NAME}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Home</Link>
          <Link to="/pricing" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Pricing</Link>
          {isAuthenticated && (
            <Badge variant="outline" className="h-8 px-3 font-black text-[9px] uppercase tracking-widest bg-primary/5 border-primary/20">
              <User className="h-3 w-3 mr-1.5" /> {user?.name?.split(' ')[0]}
            </Badge>
          )}
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-shimmer">Client Portal</h1>
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Manage your Stone Cold assignments</p>
            </div>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 h-14 px-8 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20">
              <Link to="/booking"><Plus className="h-4 w-4 mr-2" /> New Reservation</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary" />
                  Upcoming Sessions
                </h2>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-32 bg-muted/50 animate-pulse rounded-2xl" />)}
                  </div>
                ) : upcoming.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {upcoming.map((b) => (
                      <Card key={b.id} className="border-2 border-l-4 border-l-primary overflow-hidden glass-ice rounded-2xl">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-primary text-white font-black text-[9px] tracking-widest uppercase">
                                  {format(new Date(b.dateTime), 'MMM d, h:mm a')}
                                </Badge>
                                <Badge variant="outline" className="capitalize font-black text-[9px] tracking-widest">{b.status}</Badge>
                              </div>
                              <h3 className="text-xl font-black uppercase tracking-tight capitalize">{b.packageId} Detail</h3>
                              <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {b.vehicleSize}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Registered Site</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <Button variant="outline" size="sm" className="font-black uppercase text-[9px] tracking-widest border-2 h-10 px-4 rounded-xl">Adjust</Button>
                               <Button variant="ghost" size="sm" className="text-destructive font-black uppercase text-[9px] tracking-widest h-10 px-4">Cancel</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 border-2 border-dashed rounded-3xl text-center bg-muted/20">
                    <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">No scheduled arctic sessions found.</p>
                  </div>
                )}
              </section>
              <section>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3 text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  Fleet History
                </h2>
                <div className="space-y-3">
                  {past.length > 0 ? (
                    past.map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-5 border-2 rounded-2xl bg-background hover:bg-muted/30 transition-colors">
                        <div>
                          <div className="text-xs font-black uppercase tracking-widest capitalize">{b.packageId} Detail</div>
                          <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">{format(new Date(b.dateTime), 'PP')}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-primary">${b.totalPrice}</div>
                          <Badge variant="secondary" className="text-[8px] font-black tracking-widest uppercase">VERIFIED</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic opacity-60">Fleet history log empty.</p>
                  )}
                </div>
              </section>
            </div>
            <div className="space-y-8">
              <Card className="bg-slate-950 text-white border-2 border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <CreditCard className="h-32 w-32" />
                </div>
                <CardHeader className="p-8">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Vault Membership
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6 relative z-10">
                  {mySub ? (
                    <>
                      <div className="space-y-1">
                        <div className="text-4xl font-black tracking-tighter uppercase text-shimmer">{mySub.planType}</div>
                        <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Status: Operational</p>
                      </div>
                      <div className="pt-6 border-t border-slate-800">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Cycle Reset</span>
                          <span className="text-primary">{format(new Date(mySub.nextRenewal), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-2 space-y-6">
                      <p className="text-[10px] text-slate-400 font-black uppercase leading-relaxed tracking-widest">Join the Arctic Circle for 20% savings on recurring details.</p>
                      <Button className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl font-black uppercase text-xs tracking-widest">Initialize Member Plan</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/10 bg-primary/[0.02] rounded-[2rem]">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Transmission Node</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tight mb-6 leading-relaxed">Broadcast your referral key to capture $20 in service credits.</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-background border-2 border-border/50 rounded-xl px-4 py-3 text-[10px] font-mono font-black text-primary uppercase">SC-ELITE-{user?.id?.slice(0, 4)}</div>
                    <Button size="sm" variant="outline" className="border-2 font-black uppercase text-[9px] tracking-widest h-11 px-4 rounded-xl">Copy</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}