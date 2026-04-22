import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBookingStore } from '@/store/booking-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Loader2, Lock, CreditCard, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { api } from '@/lib/api-client';
const contactSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(10, 'Complete service address required'),
});
type ContactValues = z.infer<typeof contactSchema>;
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState('Securing session...');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const setStep = useBookingStore(s => s.setStep);
  const contact = useBookingStore(s => s.contact);
  const setContact = useBookingStore(s => s.setContact);
  const vehicleSize = useBookingStore(s => s.vehicleSize);
  const packageId = useBookingStore(s => s.packageId);
  const addOns = useBookingStore(s => s.addOns);
  const dateTime = useBookingStore(s => s.dateTime);
  const setConfirmedBookingId = useBookingStore(s => s.setConfirmedBookingId);
  const getTotalPrice = useBookingStore(s => s.getTotalPrice);
  const user = useAuthStore(s => s.user);
  useEffect(() => {
    let mounted = true;
    const SCRIPT_ID = 'cf-turnstile-script';
    
    const loadTurnstile = () => {
      if ((window as any).turnstile) {
        renderTurnstile();
        return;
      }
      
      const existingScript = document.getElementById(SCRIPT_ID);
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (mounted) renderTurnstile();
        };
        document.body.appendChild(script);
      } else {
        renderTurnstile();
      }
    };

    const renderTurnstile = () => {
      if (!widgetRef.current || widgetIdRef.current) return;
      
      const widget = (window as any).turnstile.render(widgetRef.current, {
        sitekey: '1x00000000000000000000AA',
        callback: (token: string) => {
          if (mounted) setTurnstileToken(token);
        },
        'error-callback': () => {
          if (mounted) setTurnstileToken(null);
        },
        theme: 'auto'
      });

      if (mounted && widget) {
        widgetIdRef.current = widget;
      }
    };

    loadTurnstile();

    return () => {
      mounted = false;
      if (widgetIdRef.current && (window as any).turnstile) {
        (window as any).turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);
  const { register, handleSubmit, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact
  });
  const onSubmit = async (data: ContactValues) => {
    if (!turnstileToken) return;
    setIsSubmitting(true);
    setIsRedirecting(true);
    try {
      setCheckoutStatus('Validating security handshake...');
      await new Promise(r => setTimeout(r, 600));
      await api('/api/auth/verify-turnstile', {
        method: 'POST',
        body: JSON.stringify({ token: turnstileToken })
      });
      setCheckoutStatus('Handshaking with payment gateway...');
      setContact(data);
      await new Promise(r => setTimeout(r, 800));
      setCheckoutStatus('Finalizing reservation yield...');
      const response = await api<any>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          customerId: user?.id || 'guest-client',
          vehicleSize,
          packageId,
          addOns,
          dateTime,
          contact: data,
          totalPrice: getTotalPrice(),
          turnstileToken
        })
      });
      if (response && response.id) {
        setConfirmedBookingId(response.id);
      }
      setCheckoutStatus('Verification complete.');
      await new Promise(r => setTimeout(r, 400));
      setStep(6);
    } catch (error) {
      setIsRedirecting(false);
      console.error('Booking submission failed:', error);
      if (widgetIdRef.current && (window as any).turnstile) {
        (window as any).turnstile.reset(widgetIdRef.current);
      }
      setTurnstileToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
    {isRedirecting && (
      <div className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center space-y-8 max-w-sm px-6">
          <div className="relative">
            <div className="h-24 w-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-primary/30 relative z-10">
               <Cpu className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 h-24 w-24 bg-primary/20 blur-3xl rounded-full animate-pulse mx-auto" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-shimmer">Icy Checkout</h3>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] h-4">
              {checkoutStatus}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-muted/50 border border-border/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> AES-256 Metallic Encryption
          </div>
        </div>
      </div>
    )}
    <div className="space-y-8 max-w-2xl mx-auto min-h-[500px]">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setStep(4)} className="hover:bg-primary/5 font-black uppercase text-[10px] tracking-widest border-2 border-transparent hover:border-border rounded-xl px-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
      <div className="text-center">
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Service Details</h2>
        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Specify the delivery node for the Stone Cold finish</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">First Name</Label>
            <Input {...register('firstName')} className={`h-14 border-2 rounded-xl text-sm font-bold ${errors.firstName ? 'border-destructive' : 'border-border focus:border-primary'}`} />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Last Name</Label>
            <Input {...register('lastName')} className={`h-14 border-2 rounded-xl text-sm font-bold ${errors.lastName ? 'border-destructive' : 'border-border focus:border-primary'}`} />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Email Address</Label>
          <Input type="email" {...register('email')} className={`h-14 border-2 rounded-xl text-sm font-bold ${errors.email ? 'border-destructive' : 'border-border focus:border-primary'}`} />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Phone Number</Label>
          <Input {...register('phone')} className={`h-14 border-2 rounded-xl text-sm font-bold ${errors.phone ? 'border-destructive' : 'border-border focus:border-primary'}`} />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Service Address</Label>
          <Input {...register('address')} className={`h-14 border-2 rounded-xl text-sm font-bold ${errors.address ? 'border-destructive' : 'border-border focus:border-primary'}`} />
        </div>
        <div className="py-6 border-y-2 border-border/40 flex flex-col items-center min-h-[100px] justify-center">
          <div ref={widgetRef} />
          {!turnstileToken && !isSubmitting && (
            <p className="text-[9px] text-amber-600 mt-3 font-black uppercase tracking-[0.2em] flex items-center gap-2 animate-pulse">
              <ShieldAlert className="h-3 w-3" /> Hardware Attestation Required
            </p>
          )}
        </div>
        <div className="p-8 bg-primary/5 rounded-[2rem] border-2 border-primary/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-black text-[10px] uppercase tracking-widest">Vault Reservation</span>
            </div>
            <Badge className="bg-primary/20 text-primary border-none font-black text-[8px] uppercase tracking-widest px-3 h-5">STRIPE LIVE</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between font-bold text-muted-foreground uppercase text-[10px] tracking-widest">
              <span>Estimated Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-primary font-black border-t-2 border-primary/10 pt-4 uppercase tracking-tighter items-end">
              <span className="text-xs">Required Deposit</span>
              <span className="text-3xl leading-none">$20.00</span>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] justify-center opacity-60">
            <Lock className="h-3 w-3" /> Encrypted Command Port 443
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !turnstileToken}
            className="w-full bg-primary hover:bg-primary/90 h-20 text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 rounded-2xl border-t border-white/20"
          >
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              'Confirm & Reserve'
            )}
          </Button>
        </div>
      </form>
    </div>
    </>
  );
}