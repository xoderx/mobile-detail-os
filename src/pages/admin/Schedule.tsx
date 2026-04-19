import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
export default function Schedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: bookingsData } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api<{ items: any[] }>('/api/bookings'),
  });
  const allBookings = bookingsData?.items ?? [];
  const dailyJobs = allBookings.filter(b => 
    date && b.dateTime && isSameDay(new Date(b.dateTime), date)
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-10rem)]">
      <div className="lg:col-span-4 space-y-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Select Date</CardTitle>
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
        <div className="bg-brand-500 rounded-2xl p-6 text-white shadow-lg">
          <h4 className="font-bold mb-1">Capacity: {Math.round((dailyJobs.length / 8) * 100)}%</h4>
          <p className="text-xs text-brand-100">{dailyJobs.length} of 8 slots filled for this day.</p>
        </div>
      </div>
      <div className="lg:col-span-8 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm pb-4 z-10">
          <h2 className="text-2xl font-bold">
            Agenda for {date ? format(date, 'MMMM do') : 'Selected Date'}
          </h2>
          <Badge variant="outline" className="px-4 py-1">
            {dailyJobs.length} Jobs
          </Badge>
        </div>
        {dailyJobs.length > 0 ? (
          <div className="space-y-4">
            {dailyJobs.map((job) => (
              <Card key={job.id} className="group hover:border-brand-500 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-500" />
                        <span className="font-bold">{format(new Date(job.dateTime), 'h:mm a')}</span>
                        <Badge variant="secondary" className="text-[10px] uppercase">{job.status}</Badge>
                      </div>
                      <h3 className="text-lg font-bold">Customer ID: {job.customerId}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> 123 Dispatch Lane
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" /> Unassigned
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold capitalize">{job.packageId} Detail</div>
                        <div className="text-xs text-muted-foreground">{job.vehicleSize}</div>
                      </div>
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
          <div className="h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Calendar className="h-8 w-8 opacity-20" />
            <p>No jobs scheduled for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
}