import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Play, CheckCircle, Clock, MapPin, LogOut, LayoutList, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { LOGO_BASE64, BRAND_SHORT_NAME } from '@/lib/constants';
export default function JobQueue() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const techName = useAuthStore(s => s.user?.name);
  const techId = useAuthStore(s => s.user?.id);
  const logout = useAuthStore(s => s.logout);
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', techId],
    queryFn: () => api<{ items: any[] }>(`/api/bookings?technicianId=${techId}`),
    enabled: !!techId,
  });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const jobs = bookingsData?.items ?? [];
  const pendingCount = jobs.filter(j => j.status !== 'completed').length;
  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b-2 h-16 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <img src={LOGO_BASE64} alt={BRAND_SHORT_NAME} className="h-8 w-8 animate-shimmer" />
          <span className="font-black tracking-tighter uppercase text-shimmer text-base">
            {BRAND_SHORT_NAME} TECH
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden xs:flex flex-col items-end">
            <p className="text-[10px] font-black leading-none uppercase tracking-widest">{techName}</p>
            <Badge variant="outline" className="h-4 px-1.5 bg-emerald-50 text-[8px] font-black text-emerald-600 border-none uppercase tracking-tighter mt-1">ON DUTY</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive h-10 w-10">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10 pb-24">
        <div className="flex justify-between items-end px-2">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Daily Route</h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mt-1 opacity-70">{format(new Date(), 'EEEE, MMMM do')}</p>
          </div>
          <Badge className="h-8 px-4 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
            {pendingCount} Pending Assignments
          </Badge>
        </div>
        <div className="space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted rounded-[2rem]" />)}
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className={`overflow-hidden border-2 rounded-[2rem] transition-all hover:shadow-xl ${
                job.status === 'completed' ? 'border-emerald-100 opacity-60 bg-emerald-50/20' :
                job.status === 'confirmed' ? 'border-primary shadow-lg ring-2 ring-primary/10' : 'border-border/50'
              }`}>
                <CardContent className="p-0">
                  <Link to={`/tech/jobs/${job.id}`} className="block p-8 space-y-6 active:bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-black text-sm">{format(new Date(job.dateTime), 'h:mm a')}</span>
                          <Badge variant={job.status === 'completed' ? 'secondary' : 'default'} className="text-[8px] font-black uppercase px-2 h-5 tracking-widest">
                            {job.status}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight capitalize leading-none">{job.packageId} Detail</h3>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{job.vehicleSize} • Reference: {job.id.slice(0, 5).toUpperCase()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-primary">${job.totalPrice}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 bg-muted/20 p-4 rounded-2xl border-2 border-muted/30">
                      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="line-clamp-1">Service Site: Registered Fleet Loc.</span>
                      </div>
                    </div>
                  </Link>
                  {job.status !== 'completed' && (
                    <div className="grid grid-cols-2 border-t-2 divide-x-2 h-16">
                      <Button variant="ghost" className="h-full rounded-none gap-3 hover:bg-primary/5 font-black uppercase text-[10px] tracking-widest" asChild>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent('Client Site')}`} target="_blank" rel="noreferrer">
                          <Navigation className="h-4 w-4 text-primary" /> Route
                        </a>
                      </Button>
                      {job.status === 'confirmed' ? (
                        <Button
                          variant="ghost"
                          className="h-full rounded-none gap-3 hover:bg-emerald-50 text-emerald-600 font-black uppercase text-[10px] tracking-widest"
                          onClick={(e) => {
                            e.preventDefault();
                            updateStatus.mutate({ id: job.id, status: 'completed' });
                          }}
                        >
                          <CheckCircle className="h-4 w-4" /> Finalize
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className="h-full rounded-none gap-3 hover:bg-primary/5 text-primary font-black uppercase text-[10px] tracking-widest bg-metallic/5"
                          onClick={(e) => {
                            e.preventDefault();
                            updateStatus.mutate({ id: job.id, status: 'confirmed' });
                          }}
                        >
                          <Play className="h-4 w-4" /> Initiate
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-muted/10 rounded-[3rem] border-4 border-dashed border-muted text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center">
                <LayoutList className="h-10 w-10 text-muted-foreground opacity-30" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-black uppercase tracking-widest">No Active Assignments</p>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Check back later for new route nodes.</p>
              </div>
              <Button 
                variant="outline" 
                className="font-black uppercase text-[10px] tracking-widest border-2 rounded-xl h-12 px-8 mt-4" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })}
              >
                <RefreshCcw className="h-3 w-3 mr-2" /> Sync Queue
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}