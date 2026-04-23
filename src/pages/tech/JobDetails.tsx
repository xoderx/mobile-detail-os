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
import { LOGO_BASE64, BRAND_SHORT_NAME } from '@/lib/constants';
import { toast } from 'sonner';
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
    // Merge server-side checklist with defaults to ensure full protocol compliance
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
    onSuccess: (res, status) => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(`Operational Status: ${status.toUpperCase()}`);
    },
  });
  const updateChecklistMutation = useMutation({
    mutationFn: (checklist: Record<string, boolean>) =>
      api(`/api/bookings/${id}/checklist`, {
        method: 'PATCH',
        body: JSON.stringify({ checklist })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success("Protocol Synced", { duration: 1000 });
    },
  });
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const allChecked = Object.keys(localChecklist).every(key => localChecklist[key] === true);
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto" />
        <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Establishing Uplink...</p>
      </div>
    </div>
  );
  if (!booking) return (
    <div className="p-12 text-center space-y-6">
      <p className="font-black uppercase text-sm tracking-[0.3em]">Access Denied: Terminal Null</p>
      <Button onClick={() => navigate('/tech')} className="bg-primary h-14 px-8 rounded-2xl font-black uppercase text-xs">Return to Fleet</Button>
    </div>
  );
  const toggleCheck = (item: string) => {
    if (booking.status === 'completed') return;
    const next = { ...localChecklist, [item]: !localChecklist[item] };
    setLocalChecklist(next);
    updateChecklistMutation.mutate(next);
  };
  const handleStatusTransition = () => {
    if (booking.status === 'pending') {
      updateStatus.mutate('confirmed');
    } else if (booking.status === 'confirmed') {
      if (!allChecked) {
        toast.error("Protocol Incomplete: Verify all checklist items before sign-off.");
        return;
      }
      updateStatus.mutate('completed');
    }
  };
  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b-2 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => navigate('/tech')} className="-ml-2 h-10 w-10 rounded-xl hover:bg-primary/5">
          <ChevronLeft className="h-6 w-6 text-primary" />
        </Button>
        <div className="flex items-center gap-3">
           <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg border border-white/20">
              <Package className="h-5 w-5" />
           </div>
           <span className="font-black text-sm tracking-tighter uppercase text-shimmer">{BRAND_SHORT_NAME} OPS</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive h-10 w-10 rounded-xl">
          <LogOut className="h-5 w-5" />
        </Button>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10 pb-24">
        <div className="flex items-center justify-between px-2">
          <div className="max-w-[70%]">
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none truncate">
              {booking.contact?.firstName || 'Guest'} {booking.contact?.lastName || 'Client'}
            </h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-2 opacity-60">
              Deployment: {format(new Date(booking.dateTime), 'h:mm a')}
            </p>
          </div>
          <Badge className={`uppercase font-black text-[9px] tracking-widest px-4 h-8 flex items-center shadow-lg ${booking.status === 'completed' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-primary shadow-primary/20'}`}>
            {booking.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-ice border-2 border-primary/10 rounded-[1.5rem] shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center"><Car className="h-5 w-5 text-primary" /></div>
              <div className="overflow-hidden">
                <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest opacity-60">Chassis</p>
                <p className="text-xs font-black uppercase tracking-tight truncate">{booking.vehicleSize}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-ice border-2 border-primary/10 rounded-[1.5rem] shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center"><Package className="h-5 w-5 text-primary" /></div>
              <div className="overflow-hidden">
                <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest opacity-60">Protocol</p>
                <p className="text-xs font-black uppercase tracking-tight truncate">{booking.packageId}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-2 border-primary/10 glass-ice rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="bg-primary/5 border-b-2 border-primary/10 py-6 px-8 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Operational Protocol
            </CardTitle>
            {updateChecklistMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y-2 divide-primary/5">
              {Object.keys(localChecklist).map((item) => (
                <div
                  key={item}
                  className={`flex items-center space-x-6 p-6 transition-all cursor-pointer group ${localChecklist[item] ? 'bg-primary/5 opacity-50' : 'bg-white hover:bg-slate-50'}`}
                  onClick={() => toggleCheck(item)}
                >
                  <Checkbox
                    checked={localChecklist[item]}
                    onCheckedChange={() => toggleCheck(item)}
                    id={item}
                    disabled={booking.status === 'completed'}
                    className="h-6 w-6 border-2 border-primary/30 rounded-lg data-[state=checked]:bg-primary"
                  />
                  <label htmlFor={item} className={`flex-1 text-sm font-black uppercase tracking-widest cursor-pointer transition-all ${localChecklist[item] ? 'line-through text-muted-foreground' : 'text-slate-800'}`}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-6">
          <Button size="lg" variant="outline" className="h-16 gap-3 font-black uppercase text-[10px] tracking-widest bg-white border-2 border-border/50 rounded-2xl hover:bg-primary/5 transition-all shadow-sm" asChild>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.contact?.address || 'Client Site')}`} target="_blank" rel="noreferrer">
              <Navigation className="h-5 w-5 text-primary" /> Global Route
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-16 gap-3 font-black uppercase text-[10px] tracking-widest bg-white border-2 border-border/50 rounded-2xl hover:bg-emerald-50 transition-all shadow-sm" asChild>
            <a href={`tel:${booking.contact?.phone || '5550000'}`}>
              <Phone className="h-5 w-5 text-emerald-600" /> Secure Comm
            </a>
          </Button>
        </div>
        <div className="pt-6">
          <Button
            className={cn(
              "w-full h-20 text-xl font-black uppercase tracking-[0.3em] shadow-2xl rounded-3xl active:scale-[0.98] transition-all border-t-2 border-white/20",
              booking.status === 'completed' ? 'bg-slate-200 text-slate-500 border-none cursor-default shadow-none' : 
              (booking.status === 'confirmed' && allChecked) ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 
              (booking.status === 'confirmed' && !allChecked) ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed' :
              'bg-primary hover:bg-primary/90 shadow-primary/20'
            )}
            onClick={handleStatusTransition}
            disabled={updateStatus.isPending || (booking.status === 'confirmed' && !allChecked) || booking.status === 'completed'}
          >
            {updateStatus.isPending ? <Loader2 className="h-8 w-8 animate-spin" /> : 
             booking.status === 'pending' ? 'Establish Arrival' : 
             booking.status === 'confirmed' ? (allChecked ? 'Manifest Sign-off' : 'Complete Protocols') : 'Job Finalized'}
          </Button>
          <div className="mt-10 flex gap-4 items-start bg-amber-500/10 p-6 rounded-[2rem] border-2 border-amber-500/20 animate-crackle">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-600">Arctic Safety Protocol</p>
               <p className="text-[11px] text-amber-800 leading-relaxed font-bold uppercase tracking-tight">
                Ensure vehicle surface temperature is stabilized. Double check wheel decontamination zones before frozen finish application.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}