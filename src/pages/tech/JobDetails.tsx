import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ChevronLeft, MapPin, Phone, Navigation, CheckCircle2,
  Clock, Car, Package, AlertCircle, Loader2, LogOut
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
  const logout = useAuthStore(s => s.logout);
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
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-brand-600" />
    </div>
  );
  if (!booking) return (
    <div className="p-12 text-center space-y-4">
      <p className="font-bold">Job assignment not found.</p>
      <Button onClick={() => navigate('/tech')}>Back to Queue</Button>
    </div>
  );
  const toggleCheck = (item: string) => {
    const next = { ...localChecklist, [item]: !localChecklist[item] };
    setLocalChecklist(next);
    updateChecklist.mutate(next);
  };
  const allChecked = Object.values(localChecklist).every(v => v);
  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-background border-b h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => navigate('/tech')} className="-ml-2">
          <ChevronLeft className="h-5 w-5 mr-1" />
        </Button>
        <span className="font-bold text-sm">Job Detail</span>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="h-5 w-5" />
        </Button>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {booking.contact?.firstName} {booking.contact?.lastName}
            </h1>
            <p className="text-sm text-muted-foreground font-medium">{format(new Date(booking.dateTime), 'h:mm a, MMM dd')}</p>
          </div>
          <Badge variant={booking.status === 'completed' ? 'secondary' : 'default'} className="uppercase">
            {booking.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/50 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <Car className="h-5 w-5 text-brand-500" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Vehicle</p>
                <p className="text-sm font-bold capitalize">{booking.vehicleSize}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <Package className="h-5 w-5 text-brand-500" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Service</p>
                <p className="text-sm font-bold capitalize">{booking.packageId}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white/80 border-b py-4">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-600" />
                Service Checklist
              </div>
              {updateChecklist.isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {Object.keys(localChecklist).map((item) => (
                <div
                  key={item}
                  className={`flex items-center space-x-3 p-4 transition-colors cursor-pointer ${localChecklist[item] ? 'bg-slate-50/50' : 'bg-white'}`}
                  onClick={() => toggleCheck(item)}
                >
                  <Checkbox checked={localChecklist[item]} onCheckedChange={() => toggleCheck(item)} id={item} className="h-5 w-5 border-2" />
                  <label htmlFor={item} className={`flex-1 text-sm font-bold cursor-pointer ${localChecklist[item] ? 'line-through text-muted-foreground' : 'text-slate-700'}`}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Button size="lg" variant="outline" className="h-14 gap-2 font-bold bg-white" asChild>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.location || 'Client Location')}`} target="_blank" rel="noreferrer">
              <Navigation className="h-5 w-5 text-brand-600" /> Navigate
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-14 gap-2 font-bold bg-white" asChild>
            <a href={`tel:${booking.contact?.phone || '5550000'}`}>
              <Phone className="h-5 w-5 text-emerald-600" /> Call Client
            </a>
          </Button>
        </div>
        <Card className="bg-brand-600 text-white border-none shadow-lg">
          <CardContent className="p-6 space-y-4">
            {booking.status === 'pending' && (
              <Button className="w-full bg-white text-brand-600 hover:bg-slate-100 h-14 text-lg font-bold" onClick={() => updateStatus.mutate('confirmed')}>
                Mark Arrived
              </Button>
            )}
            {booking.status === 'confirmed' && (
              <Button className="w-full bg-white text-brand-600 hover:bg-slate-100 h-14 text-lg font-bold" disabled={!allChecked || updateStatus.isPending} onClick={() => updateStatus.mutate('completed')}>
                {updateStatus.isPending ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                {allChecked ? 'Finish & Sign-off' : 'Complete Checklist First'}
              </Button>
            )}
            <div className="flex gap-2 items-start bg-brand-500/30 p-4 rounded-xl border border-white/10">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-xs text-brand-50 leading-relaxed font-medium">
                Note: Client requested a high-shine finish on wheels. Double check tire dressing application.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}