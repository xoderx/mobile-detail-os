import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ChevronLeft,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  Car,
  Package,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
const DEFAULT_CHECKLIST = {
  'Exterior Wash': false,
  'Wheel Cleaning': false,
  'Interior Vacuum': false,
  'Glass Cleaning': false,
  'Tire Dressing': false,
};
export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [localChecklist, setLocalChecklist] = useState<Record<string, boolean>>(DEFAULT_CHECKLIST);
  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => api<any>(`/api/bookings/${id}`),
    enabled: !!id,
  });
  useEffect(() => {
    if (booking?.checklist) {
      setLocalChecklist(prev => ({ ...prev, ...booking.checklist }));
    }
  }, [booking]);
  const updateStatus = useMutation({
    mutationFn: (status: string) =>
      api(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
  const updateChecklist = useMutation({
    mutationFn: (checklist: Record<string, boolean>) =>
      api(`/api/bookings/${id}/checklist`, {
        method: 'PATCH',
        body: JSON.stringify({ checklist })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
    },
  });
  if (isLoading) return <div className="p-12 text-center flex items-center justify-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading job details...</div>;
  if (!booking) return <div className="p-12 text-center">Job not found.</div>;
  const toggleCheck = (item: string) => {
    const next = { ...localChecklist, [item]: !localChecklist[item] };
    setLocalChecklist(next);
    updateChecklist.mutate(next);
  };
  const allChecked = Object.values(localChecklist).every(v => v);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Queue
          </Button>
          <Badge variant={booking.status === 'completed' ? 'secondary' : 'default'} className="uppercase px-3">
            {booking.status}
          </Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {booking.contact?.firstName} {booking.contact?.lastName}
              </h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5"><Car className="h-4 w-4" /> {booking.vehicleSize}</div>
                <div className="flex items-center gap-1.5"><Package className="h-4 w-4" /> {booking.packageId} Package</div>
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {format(new Date(booking.dateTime), 'PPP p')}</div>
              </div>
            </motion.div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-500" />
                  Service Checklist
                </CardTitle>
                {updateChecklist.isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.keys(localChecklist).map((item) => (
                  <div 
                    key={item} 
                    className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer" 
                    onClick={() => toggleCheck(item)}
                  >
                    <Checkbox checked={localChecklist[item]} onCheckedChange={() => toggleCheck(item)} id={item} />
                    <label htmlFor={item} className={`flex-1 text-sm font-medium leading-none cursor-pointer ${localChecklist[item] ? 'line-through text-muted-foreground' : ''}`}>
                      {item}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <Button size="lg" className="h-16 gap-2 text-lg" variant="outline" asChild>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.location || 'Current Location')}`} target="_blank" rel="noreferrer">
                  <Navigation className="h-5 w-5 text-brand-500" /> Navigate
                </a>
              </Button>
              <Button size="lg" className="h-16 gap-2 text-lg" variant="outline" asChild>
                <a href={`tel:${booking.contact?.phone || '5550000'}`}>
                  <Phone className="h-5 w-5 text-brand-500" /> Call
                </a>
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="bg-brand-50 border-brand-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-brand-900">Job Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.status === 'pending' && (
                  <Button className="w-full bg-brand-600 hover:bg-brand-700 h-12" onClick={() => updateStatus.mutate('confirmed')}>
                    Confirm Arrival
                  </Button>
                )}
                {booking.status === 'confirmed' && (
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12" disabled={!allChecked || updateStatus.isPending} onClick={() => updateStatus.mutate('completed')}>
                    {updateStatus.isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    {allChecked ? 'Complete Job' : 'Complete Checklist First'}
                  </Button>
                )}
                <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10">Report Issue</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Location Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{booking.location || '123 Customer Address, Suite 100'}</span>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800">
                    Customer requested "No fragrance" in the interior wipe down.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}