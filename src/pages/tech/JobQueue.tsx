import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Play, CheckCircle, Clock, MapPin, LogOut } from 'lucide-react';
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
  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <img src={LOGO_BASE64} alt={BRAND_SHORT_NAME} className="h-8 w-8 animate-shimmer" />
          <span className="font-black tracking-tighter uppercase text-shimmer text-sm sm:text-base">
            {BRAND_SHORT_NAME} Tech
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right mr-2">
            <p className="text-xs font-bold leading-none">{techName}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">On Duty</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Daily Route</h1>
            <p className="text-muted-foreground text-sm font-medium">{format(new Date(), 'EEEE, MMMM do')}</p>
          </div>
          <Badge variant="outline" className="h-8 px-4 bg-background shadow-sm border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest">
            {jobs.filter(j => j.status !== 'completed').length} Pending
          </Badge>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-2xl" />)}
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className={`overflow-hidden border-l-4 transition-all hover:shadow-md ${
                job.status === 'completed' ? 'border-l-emerald-500 opacity-70' :
                job.status === 'confirmed' ? 'border-l-primary' : 'border-l-slate-300'
              }`}>
                <CardContent className="p-0">
                  <Link to={`/tech/jobs/${job.id}`} className="block p-5 space-y-4 active:bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-bold">{format(new Date(job.dateTime), 'h:mm a')}</span>
                          <Badge variant={job.status === 'completed' ? 'secondary' : 'default'} className="text-[9px] font-black uppercase px-2">
                            {job.status}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight capitalize">{job.packageId} Detail</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{job.vehicleSize}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-primary">${job.totalPrice}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 bg-muted/20 p-3 rounded-lg border border-muted/30">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="line-clamp-1">Service Site: Registered Location</span>
                      </div>
                    </div>
                  </Link>
                  {job.status !== 'completed' && (
                    <div className="grid grid-cols-2 border-t divide-x h-14">
                      <Button variant="ghost" className="h-full rounded-none gap-2 hover:bg-primary/5 font-black uppercase text-[10px] tracking-widest" asChild>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent('Client Site')}`} target="_blank" rel="noreferrer">
                          <Navigation className="h-4 w-4 text-primary" /> Navigate
                        </a>
                      </Button>
                      {job.status === 'confirmed' ? (
                        <Button
                          variant="ghost"
                          className="h-full rounded-none gap-2 hover:bg-emerald-50 text-emerald-600 font-black uppercase text-[10px] tracking-widest"
                          onClick={(e) => {
                            e.preventDefault();
                            updateStatus.mutate({ id: job.id, status: 'completed' });
                          }}
                        >
                          <CheckCircle className="h-4 w-4" /> Finish
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className="h-full rounded-none gap-2 hover:bg-primary/5 text-primary font-black uppercase text-[10px] tracking-widest"
                          onClick={(e) => {
                            e.preventDefault();
                            updateStatus.mutate({ id: job.id, status: 'confirmed' });
                          }}
                        >
                          <Play className="h-4 w-4" /> Start
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
              <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">No active assignments.</p>
              <Button variant="link" className="text-primary font-black uppercase text-[10px] tracking-widest mt-2" onClick={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })}>Refresh Queue</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}