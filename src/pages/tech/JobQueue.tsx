import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Play, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';
export default function JobQueue() {
  const queryClient = useQueryClient();
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api<{ items: any[] }>('/api/bookings'),
  });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      api(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
  const jobs = bookingsData?.items ?? [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-brand-600 font-bold text-sm uppercase tracking-wider">Technician Hub</span>
            <h1 className="text-3xl font-bold tracking-tight">Daily Route</h1>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{format(new Date(), 'MMM dd')}</div>
            <div className="text-sm text-muted-foreground">Assigned to: Tech #1</div>
          </div>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-2xl" />)}
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className={`overflow-hidden border-l-4 ${
                job.status === 'completed' ? 'border-l-emerald-500' : 
                job.status === 'confirmed' ? 'border-l-brand-500' : 'border-l-slate-300'
              }`}>
                <CardContent className="p-0">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-brand-600" />
                          <span className="font-bold">{format(new Date(job.dateTime), 'h:mm a')}</span>
                          <Badge variant={job.status === 'completed' ? 'secondary' : 'default'} className="text-[10px]">
                            {job.status.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold capitalize">{job.packageId} Detail</h3>
                        <p className="text-muted-foreground text-sm uppercase tracking-tighter">{job.vehicleSize}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-brand-600">${job.totalPrice}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 bg-muted/30 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>123 Customer Ave, Suite 400</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-brand-600 font-medium">(555) 000-0000</span>
                      </div>
                    </div>
                  </div>
                  {job.status !== 'completed' && (
                    <div className="grid grid-cols-2 border-t divide-x h-16">
                      <Button variant="ghost" className="h-full rounded-none gap-2 hover:bg-brand-50" asChild>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent('123 Customer Ave')}`} target="_blank" rel="noreferrer">
                          <Navigation className="h-4 w-4 text-brand-600" /> Navigate
                        </a>
                      </Button>
                      {job.status === 'confirmed' ? (
                        <Button 
                          variant="ghost" 
                          className="h-full rounded-none gap-2 hover:bg-emerald-50 text-emerald-600 font-bold"
                          onClick={() => updateStatus.mutate({ id: job.id, status: 'completed' })}
                        >
                          <CheckCircle className="h-4 w-4" /> Complete
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          className="h-full rounded-none gap-2 hover:bg-brand-50 text-brand-600 font-bold"
                          onClick={() => updateStatus.mutate({ id: job.id, status: 'confirmed' })}
                        >
                          <Play className="h-4 w-4" /> Start Job
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
              <p className="text-muted-foreground">No jobs assigned for today.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}