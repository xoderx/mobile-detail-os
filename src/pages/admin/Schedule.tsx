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
import { Clock, MapPin, User, ChevronRight, Loader2, Snowflake } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { toast } from 'sonner';
export default function Schedule() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  // Fetch all users to filter technicians dynamically
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => api<{ items: any[] }>('/api/users'),
  });
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
      toast.success("Dispatcher: Resource allocated to node");
    },
    onError: () => {
      toast.error("Resource allocation failure");
    }
  });
  const allBookings = bookingsData?.items ?? [];
  const dailyJobs = allBookings.filter(b =>
    date && b.dateTime && isSameDay(new Date(b.dateTime), date)
  );
  // Extract technicians from live user data
  const technicians = (usersData?.items ?? []).filter(u => u.role === 'tech');
  const getTechLoad = (techId: string) => {
    return dailyJobs.filter(b => b.technicianId === techId).length;
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in pb-20">
      <div className="lg:col-span-4 space-y-8">
        <Card className="border-2 border-border/50 glass-ice rounded-[2.5rem] shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Temporal Node
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-xl border-none mx-auto"
            />
          </CardContent>
        </Card>
        <Card className="border-2 border-border/50 glass-ice rounded-[2.5rem] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Team Payload Index</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {technicians.length > 0 ? technicians.map((tech) => {
              const load = getTechLoad(tech.id);
              const isBusy = load >= 3;
              return (
                <div key={tech.id} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{tech.name}</span>
                    <span className={isBusy ? 'text-amber-600' : 'text-primary'}>{load}/4 NODES</span>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden border border-border/10">
                    <div
                      className={`h-full transition-all duration-700 ease-out ${isBusy ? 'bg-amber-500' : 'bg-primary'}`}
                      style={{ width: `${(load / 4) * 100}%` }}
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 text-center">No Technicians Logged</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-8 space-y-6 pr-2">
        <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md pb-6 z-10 border-b-2 mb-8 pt-2">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              {date ? format(date, 'EEEE, MMM do') : 'Select Terminal Date'}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Operational Dispatch Queue</p>
          </div>
          <div className="flex items-center gap-4">
            {(assignTech.isPending || bookingsLoading) && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            <Badge className="bg-primary/10 text-primary border-2 border-primary/20 px-4 py-1.5 font-black uppercase text-[10px] tracking-widest h-8 flex items-center">
              {dailyJobs.length} ACTIVE ASSIGNMENTS
            </Badge>
          </div>
        </div>
        {dailyJobs.length > 0 ? (
          <div className="space-y-6">
            {dailyJobs.map((job) => {
              const isUnassigned = !job.technicianId || job.technicianId === 'unassigned';
              return (
                <Card key={job.id} className={`group transition-all border-2 border-l-8 rounded-[2rem] overflow-hidden ${isUnassigned ? 'border-l-amber-500 border-amber-500/10 bg-amber-50/5' : 'border-l-primary border-primary/10 glass-ice hover:shadow-xl'}`}>
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-black text-sm uppercase">{format(new Date(job.dateTime), 'h:mm a')}</span>
                          {isUnassigned && (
                            <Badge variant="outline" className="text-[8px] bg-amber-50 text-amber-700 border-amber-200 font-black uppercase px-2 h-5 tracking-widest">PENDING_ALLOCATION</Badge>
                          )}
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight capitalize leading-none">{job.packageId} TREATMENT - {job.vehicleSize}</h3>
                        <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Registered Deployment Site</div>
                          <div className={`flex items-center gap-2 ${isUnassigned ? 'text-amber-600' : 'text-foreground'}`}>
                            <User className="h-4 w-4" />
                            {technicians.find(t => t.id === job.technicianId)?.name || 'NEEDS RESOURCE'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 border-t-2 md:border-t-0 pt-6 md:pt-0">
                        <Select
                          defaultValue={job.technicianId || 'unassigned'}
                          onValueChange={(val) => assignTech.mutate({ id: job.id, technicianId: val })}
                          disabled={assignTech.isPending}
                        >
                          <SelectTrigger className="w-[220px] h-12 border-2 rounded-xl font-black uppercase text-[10px] tracking-widest bg-background/50">
                            <SelectValue placeholder="Establish Link" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned" className="text-[10px] font-black uppercase">Unassigned</SelectItem>
                            {technicians.map(t => (
                              <SelectItem key={t.id} value={t.id} className="text-[10px] font-black uppercase">{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all">
                          <ChevronRight className="h-6 w-6 text-primary" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="h-[400px] border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center text-muted-foreground gap-6 bg-muted/5 opacity-50">
            <Snowflake className="h-16 w-16 text-primary/30 animate-crackle" />
            <div className="text-center space-y-2">
              <p className="font-black uppercase tracking-[0.3em]">Temporal Silence</p>
              <p className="text-[10px] font-black uppercase tracking-widest">No assignments logged for this cycle.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}