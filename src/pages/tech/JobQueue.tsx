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
      <header className="sticky top-0 z-50 bg-background border-b h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-brand-600 flex items-center justify-center text-white font-bold text-sm">DX</div>
          <span className="font-bold tracking-tight">Detail Deluxe Tech</span>
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
            <h1 className="text-3xl font-bold tracking-tight">Daily Route</h1>
            <p className="text-muted-foreground text-sm font-medium">{format(new Date(), 'EEEE, MMMM do')}</p>
          </div>
          <Badge variant="outline" className="h-8 px-4 bg-background shadow-sm border-brand-100 text-brand-700">
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
                job.status === 'confirmed' ? 'border-l-brand-500' : 'border-l-slate-300'
              }`}>
                <CardContent className="p-0">
                  <Link to={`/tech/jobs/${job.id}`} className="block p-5 space-y-4 active:bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-brand-600" />
                          <span className="font-bold">{format(new Date(job.dateTime), 'h:mm a')}</span>
                          <Badge variant={job.status === 'completed' ? 'secondary' : 'default'} className="text-[9px] font-bold">
                            {job.status.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold capitalize">{job.packageId} Detail</h3>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{job.vehicleSize}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-brand-600">${job.totalPrice}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 bg-muted/20 p-3 rounded-lg border border-muted/30">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="line-clamp-1">Client Address: See Map</span>
                      </div>
                    </div>
                  </Link>
                  {job.status !== 'completed' && (
                    <div className="grid grid-cols-2 border-t divide-x h-14">
                      <Button variant="ghost" className="h-full rounded-none gap-2 hover:bg-brand-50" asChild>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent('Current Location')}`} target="_blank" rel="noreferrer">
                          <Navigation className="h-4 w-4 text-brand-600" /> Navigate
                        </a>
                      </Button>
                      {job.status === 'confirmed' ? (
                        <Button
                          variant="ghost"
                          className="h-full rounded-none gap-2 hover:bg-emerald-50 text-emerald-600 font-bold"
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
                          className="h-full rounded-none gap-2 hover:bg-brand-50 text-brand-600 font-bold"
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
              <p className="text-muted-foreground font-medium">No assignments scheduled for you today.</p>
              <Button variant="link" className="text-brand-600 font-bold" onClick={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })}>Refresh Queue</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}