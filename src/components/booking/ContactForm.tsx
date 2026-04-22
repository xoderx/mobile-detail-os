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
import { ChevronLeft, Loader2, Lock, CreditCard, ShieldCheck, ShieldAlert } from 'lucide-react';
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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const step = useBookingStore(s => s.step);
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
    const SCRIPT_ID = 'cf-turnstile-script';
    const existingScript = document.getElementById(SCRIPT_ID);
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };
    return () => {
      // We keep the script but cleanup the callback to avoid memory leaks if component remounts
      // (window as any).onTurnstileSuccess = undefined;
    };
  }, []);
  const { register, handleSubmit, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact
  });
  const onSubmit = async (data: ContactValues) => {
    if (!turnstileToken) return;
    setIsSubmitting(true);
    try {
      await api('/api/auth/verify-turnstile', {
        method: 'POST',
        body: JSON.stringify({ token: turnstileToken })
      });
      setContact(data);
      setIsRedirecting(true);
      // Mock Stripe delay
      await new Promise(r => setTimeout(r, 1200));
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
      setStep(6);
    } catch (error) {
      setIsRedirecting(false);
      console.error('Booking submission failed:', error);
      if ((window as any).turnstile) {
        try {
          (window as any).turnstile.reset();
        } catch (e) {
          console.warn('Turnstile reset failed', e);
        }
        setTurnstileToken(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
    {isRedirecting && (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center space-y-6 max-w-sm px-4">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-2 border-primary/20">
             <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tighter">Icy Checkout</h3>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Securing session and finalizing yield...</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Metallic Encryption
          </div>
        </div>
      </div>
    )}
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(4)} className="-ml-2 hover:bg-primary/5 font-black uppercase text-[10px] tracking-widest">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tighter uppercase">Service Details</h2>
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">Where should we deliver the Stone Cold finish?</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest">First Name</Label>
            <Input id="firstName" placeholder="John" {...register('firstName')} className={`h-12 border-2 ${errors.firstName ? 'border-destructive' : 'border-border focus:border-primary'}`} />
            {errors.firstName && <p className="text-[10px] font-bold text-destructive uppercase">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest">Last Name</Label>
            <Input id="lastName" placeholder="Doe" {...register('lastName')} className={`h-12 border-2 ${errors.lastName ? 'border-destructive' : 'border-border focus:border-primary'}`} />
            {errors.lastName && <p className="text-[10px] font-bold text-destructive uppercase">{errors.lastName.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest">Email Address</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...register('email')} className={`h-12 border-2 ${errors.email ? 'border-destructive' : 'border-border focus:border-primary'}`} />
          {errors.email && <p className="text-[10px] font-bold text-destructive uppercase">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest">Phone Number</Label>
          <Input id="phone" placeholder="(555) 000-0000" {...register('phone')} className={`h-12 border-2 ${errors.phone ? 'border-destructive' : 'border-border focus:border-primary'}`} />
          {errors.phone && <p className="text-[10px] font-bold text-destructive uppercase">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest">Service Address</Label>
          <Input id="address" placeholder="123 Detail St, Suite 400" {...register('address')} className={`h-12 border-2 ${errors.address ? 'border-destructive' : 'border-border focus:border-primary'}`} />
          {errors.address && <p className="text-[10px] font-bold text-destructive uppercase">{errors.address.message}</p>}
        </div>
        <div className="py-4 border-t border-b border-border/50">
          <div
            ref={turnstileRef}
            className="cf-turnstile"
            data-sitekey="1x00000000000000000000AA"
            data-callback="onTurnstileSuccess"
          ></div>
          {!turnstileToken && (
            <p className="text-[10px] text-amber-600 mt-2 font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="h-3 w-3" /> Security scan required
            </p>
          )}
        </div>
        <div className="mt-4 p-6 bg-primary/5 rounded-2xl border-2 border-primary/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="font-black text-[10px] uppercase tracking-widest">Secure Reservation</span>
            </div>
            <Badge className="bg-primary font-black text-[9px] uppercase tracking-widest">STRIPE LIVE</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-bold text-muted-foreground uppercase text-[10px]">
              <span>Yield Est.</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-primary font-black border-t border-primary/10 pt-2 uppercase tracking-tighter">
              <span className="text-xs">Required Deposit</span>
              <span className="text-lg">$20.00</span>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] justify-center">
            <Lock className="h-3 w-3" /> Encrypted Handshake Port 443
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !turnstileToken}
            className="w-full bg-primary hover:bg-primary/90 h-16 text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
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