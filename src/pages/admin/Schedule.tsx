import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, MapPin, User, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { toast } from 'sonner';
export default function Schedule() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api<{ items: any[] }>('/api/bookings'),
  });
  const assignTech = useMutation({
    mutationFn: ({ id, technicianId }: { id: string; technicianId: string }) =>
      api(`/api/bookings/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify({ technicianId })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success("Dispatcher: Job assigned to technician");
    },
    onError: () => {
      toast.error("Failed to assign technician");
    }
  });
  const allBookings = bookingsData?.items ?? [];
  const dailyJobs = allBookings.filter(b =>
    date && b.dateTime && isSameDay(new Date(b.dateTime), date)
  );
  const technicians = [
    { id: 'tech-1', name: 'James Wilson' },
    { id: 'tech-2', name: 'Sarah Miller' },
    { id: 'tech-3', name: 'David Brown' },
  ];
  const getTechLoad = (techId: string) => {
    return dailyJobs.filter(b => b.technicianId === techId).length;
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-10rem)]">
      <div className="lg:col-span-4 space-y-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Route Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border mx-auto"
            />
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Team Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {technicians.map((tech) => {
              const load = getTechLoad(tech.id);
              const isBusy = load >= 3;
              return (
                <div key={tech.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{tech.name}</span>
                    <span className={isBusy ? 'text-amber-600' : 'text-brand-600'}>{load}/4 Jobs</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isBusy ? 'bg-amber-500' : 'bg-brand-500'}`}
                      style={{ width: `${(load / 4) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-8 space-y-4 overflow-y-auto pr-2 pb-12">
        <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm pb-4 z-10 border-b mb-6">
          <h2 className="text-2xl font-bold">
            {date ? format(date, 'EEEE, MMM do') : 'Select a date'}
          </h2>
          <div className="flex items-center gap-3">
            {assignTech.isPending && <Loader2 className="h-4 w-4 animate-spin text-brand-600" />}
            <Badge variant="secondary" className="px-4 py-1 font-bold">
              {dailyJobs.length} Jobs
            </Badge>
          </div>
        </div>
        {dailyJobs.length > 0 ? (
          <div className="space-y-4">
            {dailyJobs.map((job) => {
              const isUnassigned = !job.technicianId || job.technicianId === 'unassigned';
              return (
                <Card key={job.id} className={`group transition-all border-l-4 ${isUnassigned ? 'border-l-amber-500 bg-amber-50/10' : 'border-l-brand-500'} hover:shadow-md`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-brand-600" />
                          <span className="font-bold">{format(new Date(job.dateTime), 'h:mm a')}</span>
                          {isUnassigned && (
                            <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700 border-amber-200 font-bold px-2">UNASSIGNED</Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-bold capitalize leading-none">{job.packageId} Detail - {job.vehicleSize}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Client Address Recorded</div>
                          <div className={`flex items-center gap-1.5 font-bold ${isUnassigned ? 'text-amber-600' : 'text-foreground'}`}>
                            <User className="h-3.5 w-3.5" />
                            {technicians.find(t => t.id === job.technicianId)?.name || 'Needs Resource'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                        <Select
                          defaultValue={job.technicianId || 'unassigned'}
                          onValueChange={(val) => assignTech.mutate({ id: job.id, technicianId: val })}
                          disabled={assignTech.isPending}
                        >
                          <SelectTrigger className="w-[180px] h-10 border-slate-200">
                            <SelectValue placeholder="Dispatch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned" disabled>Assign to Team</SelectItem>
                            {technicians.map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground gap-4 bg-muted/5">
            <Calendar className="h-12 w-12 opacity-20" />
            <div className="text-center">
              <p className="font-bold">Clear Schedule</p>
              <p className="text-sm">No appointments scheduled for this date.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}