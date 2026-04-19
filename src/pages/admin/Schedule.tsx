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
import { Clock, MapPin, User, ChevronRight, AlertCircle } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { toast } from 'sonner';
export default function Schedule() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: bookingsData } = useQuery({
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
      toast.success("Technician assigned successfully");
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily View</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Team Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {technicians.map((tech) => {
              const load = getTechLoad(tech.id);
              return (
                <div key={tech.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{tech.name}</span>
                    <span className={load >= 3 ? 'text-amber-600' : 'text-emerald-600'}>{load}/4 Jobs</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${load >= 3 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
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
          <Badge variant="secondary" className="px-4">
            {dailyJobs.length} Appointments
          </Badge>
        </div>
        {dailyJobs.length > 0 ? (
          <div className="space-y-4">
            {dailyJobs.map((job) => (
              <Card key={job.id} className="group hover:border-brand-500 transition-all border-l-4 border-l-brand-200">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-600" />
                        <span className="font-bold">{format(new Date(job.dateTime), 'h:mm a')}</span>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{job.status}</Badge>
                      </div>
                      <h3 className="text-lg font-bold capitalize">{job.packageId} Detail - {job.vehicleSize}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> 123 Dispatch Ave</div>
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <User className="h-3.5 w-3.5" /> 
                          {technicians.find(t => t.id === job.technicianId)?.name || 'Needs Assignment'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                      <Select 
                        defaultValue={job.technicianId || 'unassigned'} 
                        onValueChange={(val) => assignTech.mutate({ id: job.id, technicianId: val })}
                      >
                        <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Assign Technician" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned" disabled>Select Technician</SelectItem>
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
            ))}
          </div>
        ) : (
          <div className="h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground gap-4 bg-muted/5">
            <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
              <Calendar className="h-8 w-8 opacity-40" />
            </div>
            <div className="text-center">
              <p className="font-bold">No jobs scheduled</p>
              <p className="text-sm">Enjoy the quiet day or check another date.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}